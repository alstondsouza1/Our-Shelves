## RCA - Cypress missing required dependency: 

## Presenting Issue: 
[STARTED]  Verifying Cypress can run /root/.cache/Cypress/15.6.0/Cypress
[FAILED] Your system is missing the dependency: Xvfb
[FAILED] 
[FAILED] Install Xvfb and run Cypress again.
[FAILED] 
[FAILED] Read our documentation on dependencies for more information:
[FAILED] 
[FAILED] https://on.cypress.io/required-dependencies
[FAILED] 
[FAILED] If you are using Docker, we provide containers with all required dependencies installed.
[FAILED] 
[FAILED] ----------
[FAILED] 
[FAILED] Error: spawn Xvfb ENOENT
[FAILED] 
[FAILED] ----------
[FAILED] 
[FAILED] Platform: linux-x64 (Debian GNU/Linux - 12)
[FAILED] Cypress Version: 15.6.0
Your system is missing the dependency: Xvfb

# Investigation and Troubleshooting Steps:
- Make sure cypress is included in frontend/package.json
- Running cypress in headless mode (cypress run).
- Is Cypress installed within the container or image?
- What is the base image of the frontend dockerFile?
  
### What is xvfb?
xvfb is a node package that runs a display server Unix systems and allows graphical applications to run without a monitor or display hardware. 

### Mitigation
- Manually install Cypress directly to image within ci.yml
- Include offical Docker/cypress image within frontend/dockerfile instead of base Alpine:node image
  

