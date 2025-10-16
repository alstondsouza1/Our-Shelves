#!/bin/bash

# ==============================
# Our Shelves Deployment Script
# ==============================

echo "Starting Our Shelves deployment..."

# --- Update system ---
echo "Updating system..."
sudo apt-get update -y
sudo apt-get upgrade -y

# --- Install dependencies ---
echo "Installing dependencies (Git, Node.js, npm, MySQL, PM2)..."
sudo apt-get install -y git curl mysql-server ufw

# Install Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# --- Configure firewall (optional, recommended) ---
echo "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 3000       # Backend
sudo ufw allow 5173       # Frontend
sudo ufw allow 3306       # MySQL external access (optional)
sudo ufw --force enable

# --- Configure MySQL ---
echo "Setting up MySQL database..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Create database and user (idempotent)
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ourshelves;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'devuser'@'%' IDENTIFIED BY 'StrongPassword123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ourshelves.* TO 'devuser'@'%';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Allow external MySQL access (optional — for MySQL Workbench)
sudo sed -i "s/bind-address.*/#bind-address = 127.0.0.1/" /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# --- Clone or pull project ---
echo "Deploying application..."
cd ~
if [ ! -d "Our-Shelves" ]; then
  git clone https://github.com/alstondsouza1/Our-Shelves.git
else
  cd Our-Shelves
  git pull
fi
cd Our-Shelves

# --- Install backend ---
echo "Installing backend dependencies..."
cd backend
npm install

# Create .env file for backend
cat <<EOF > .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=devuser
DB_PASSWORD=StrongPassword123!
DB_NAME=ourshelves
PORT=3000
EOF

# --- Install frontend ---
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Create .env file for frontend
cat <<EOF > .env
VITE_API_URL=http://$(curl -s ifconfig.me):3000
EOF

# --- Start processes with PM2 ---
echo "Starting PM2 processes..."
cd ..
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tee pm2_startup.txt

# --- Done ---
echo "Deployment complete!"
echo "Backend running at: http://$(curl -s ifconfig.me):3000"
echo "Frontend running at: http://$(curl -s ifconfig.me):5173"
echo "PM2 startup instructions saved to pm2_startup.txt"
