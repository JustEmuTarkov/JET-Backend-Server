
class Initializer {
    constructor() {
        this.initializeCore();
        this.initializeExceptions();
        this.initializeClasses();
		this.initializeItemRoute();
		
		// start watermark and server
		watermark.run();
		server.start();
    }

    /* load core functionality */
    initializeCore() {
		global.startTimestamp = new Date().getTime();
		
        /* setup utilites */
		global.executedDir = process.cwd();
		global.fs = require('fs');
		global.path = require('path');
		global.util = require('util');
		global.resolve = require('path').resolve;
		global.zlib = require('zlib');
		global.https = require('https');
		global.selfsigned = require('selfsigned');
		global.psList = require('ps-list');
		global.process = require('process');
		
        global.utility = require('./util/utility.js');
        global.logger = (require('./util/logger.js').logger);
        global.json = require('./util/json.js');
		
        /* setup core files */
        global.serverConfig = json.readParsed("user/configs/server.json");
        global.modsConfig = json.readParsed("user/configs/mods.json");
        global.db = {};
        global.res = {};

        /* setup routes and cache */
        const route = require('./server/route.js');
        route.all();

        /* core logic */
        global.router = (require('./server/router.js').router);
        global.events = require('./server/events.js');
        global.server = (require('./server/server.js').server);
        global.watermark = require('./server/watermark.js');
    }

    /* load exception handler */
    initializeExceptions() {
        process.on('uncaughtException', (error, promise) => {
            logger.logError("[Server]:" + server.getVersion());
            logger.logError("[Trace]:");
            logger.logData(error);
        });
    }

    /* load loadorder from cache */
    initializeItemRoute() {
        logger.logSuccess("Create: Item Action Callbacks");
		// Load Item Route's
		// move this later to other file or something like that :)
		item_f.itemServer.updateRouteStruct();
		let itemHandlers = "";
		for(let iRoute in item_f.itemServer.routeStructure){
			itemHandlers += iRoute + ", ";
			item_f.itemServer.addRoute(iRoute, item_f.itemServer.routeStructure[iRoute]);
		}
		logger.logInfo("[Actions] " + itemHandlers.slice(0, -2));
    }

    /* load classes */
    initializeClasses() {
        logger.logSuccess("Create: Classes as global variables");
		let path = executedDir + "/src/classes";
		let files = json.readDir(path);
		let loadedModules = "";
		global["helper_f"] = require(executedDir + "/src/classes/helper.js");
		for(let file of files){
			loadedModules += file.replace(".js",", ");
			if(file == "helper.js") continue;
			let name = file.replace(".js","") + "_f";
			global[name] = require(executedDir + "/src/classes/" + file);
		}
		logger.logInfo("[Modules] " + loadedModules.slice(0, -2))
    }
}

module.exports.initializer = new Initializer();