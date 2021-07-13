const { logger } = require("../util/logger");
const { server } = require("./server");

class ConsoleResponse {
    constructor(){
        this.readline = require("readline");
        this.rl = this.readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.rl.on('line', (input) => {
            if(input.startsWith("/")){
                // command found?
                input = input.substring(1);
                const commandStructure = input.split(" ");
                if(typeof this.commands[commandStructure[0]] != "undefined"){
                    this.commands[commandStructure[0]](commandStructure);
                }
            }
        });

        this.commands = {
            // add command below !!
            "restart": this.resetServer,
            "register": this.registerAccount,
            "info": this.displayInfo,
            "help": this.displayInfo,
            "h": this.displayInfo
        }
    }
    // commands below !!
    resetServer(commandStructure){
        logger.logRequest("Executing /restart command!")
        server.softRestart();
        logger.logSuccess("Restart Completed")
    }
    displayInfo(){
        logger.logRequest("/restart -> to soft reset server (reload everything)");
        logger.logRequest("/register login edition password  -> where login need to be continuous string also with password");
        logger.logRequest("- edition is (0 -> Standard, 1 -> Prepare To Escape, 2 -> Left Behind, 3 -> Edge Of Darkness)");
        logger.logRequest("- edition and password can be empty which will create account with given login no password and standard account type");
    }
    registerAccount(commandStructure){
        logger.logRequest("Requesting account creation with data:")
        let email = commandStructure[1];
        let edition = "Standard";
        let password = "";
        if(commandStructure.length >= 3){
            switch(commandStructure[2]){
                case 1: edition = "Prepare To Escape"; break;
                case 2: edition = "Left Behind"; break;
                case 3: edition = "Edge Of Darkness"; break;
            }
        }
        if(commandStructure.length == 4){
            password = commandStructure[3];
        }
        logger.logRequest(`Login: "${email}", Password: "${password}", Edition: "${edition}"`);
        const info = {"email": email, "password": password, "edition": edition};
        account_f.handler.register(info);


    }

}

exports.consoleResponse = new ConsoleResponse();