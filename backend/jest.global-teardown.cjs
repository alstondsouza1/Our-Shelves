module.exports = async () => {
   const mysqlTestContainer = global.__MYSQL_TEST_CONTAINER__;

   if (mysqlTestContainer) {
      console.log(
         "\nStopping and cleaning up temporary MySQL database container..."
      );

      const dbModule = await import("./db.js");
      const db = dbModule.default;

      if (db) {
         await db.end();
         console.log("Database pool closed.");
      }

      await mysqlTestContainer.stop();
      console.log("MySQL Test DB stopped.");
   }
};
