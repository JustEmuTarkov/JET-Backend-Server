"use strict";
// getModFilepath
function getModFilepath(mod) {
    return "user/mods/" + mod.author + "-" + mod.name + "-" + mod.version + "/";
}
// scanRecursiveMod
function scanRecursiveMod(filepath, baseNode, modNode) {
    if (typeof modNode === "string") {
        baseNode = filepath + modNode;
    }

    if (typeof modNode === "object") {
        for (let node in modNode) {
            if (!(node in baseNode)) {
                baseNode[node] = {};
            }

            baseNode[node] = scanRecursiveMod(filepath, baseNode[node], modNode[node]);
        }
    }

    return baseNode;
}
// loadMod
function loadMod(mod, filepath) {
	let modName = `${mod.author}-${mod.name}-${mod.version}`;
	if(typeof mod.src != "undefined")
		for(let srcToExecute in mod.src){
			let path = `../../user/mods/${modName}/${mod.src[srcToExecute]}`;
			
			let ModScript = require(path).mod;
			
			ModScript(); // execute mod
		}
	if(typeof mod.res != "undefined")
		res = scanRecursiveMod(filepath, res, mod.res);
}
// detectChangedMods
function detectChangedMods() {
    let changed = false;

    for (let mod of modsConfig) {
        if (!json.exist(getModFilepath(mod) + "mod.config.json")) {
            changed = true;
            break;
        }

        let config = json.readParsed(getModFilepath(mod) + "mod.config.json");

        if (mod.name !== config.name || mod.author !== config.author || mod.version !== config.version) {
            changed = true;
            break;
        }
    }

    if (changed) {
        modsConfig = [];
    }

    return changed;
}
// detectMissingMods
function detectMissingMods() {
    if (!json.exist("user/mods/")) {
        return;
    }

    let dir = "user/mods/";
    let mods = utility.getDirList(dir);

    for (let mod of mods) {
        /* check if config exists */
        if (!json.exist(dir + mod + "/mod.config.json")) {
            logger.logError(`Mod ${mod} is missing mod.config.json`);
            continue;
			// continue starting server only with displaying error that mod wasnt loaded properly
        }

        let config = json.readParsed(dir + mod + "/mod.config.json");
        let found = false;

        /* check if mod is already in the list */
        for (let installed of modsConfig) {
            if (installed.name === config.name) {
				let modType = (config.lateExecute)?"LateExecute":"InstantExecute";
                logger.logInfo(`Mod ${mod} is installed - (${modType})`);
                found = true;
                break;
            }
        }

        /* add mod to the list */
        if (!found) {
            if (!config.version || config.files || config.filepaths) {
                logger.logError(`Mod ${mod} is out of date and not compatible with this version of ${internal.process.title}`);
                logger.logError("Forcing server shutdown...");
                internal.process.exit(1);
            }
            logger.logWarning(`Mod ${mod} not installed, adding it to the modlist`);
            modsConfig.push({"name": config.name, "author": config.author, "version": config.version, "enabled": true});
            serverConfig.rebuildCache = true;
            json.write("user/configs/mods.json", modsConfig);
        }
    }
}
// isRebuildRequired
function isRebuildRequired() {
    if (!json.exist("user/cache/mods.json")
    || !json.exist("user/cache/db.json")
    || !json.exist("user/cache/res.json")) {
        return true;
    }

    let cachedlist = json.readParsed("user/cache/mods.json");

    if (modsConfig.length !== cachedlist.length) {
        return true;
    }

    for (let mod in modsConfig) {
        /* check against cached list */
        if (modsConfig[mod].name !== cachedlist[mod].name
        || modsConfig[mod].author !== cachedlist[mod].author
        || modsConfig[mod].version !== cachedlist[mod].version
        || modsConfig[mod].enabled !== cachedlist[mod].enabled) {
            return true;
        }
    }

    return false;
}
// loadAllMods
function loadAllMods() {
    for (let element of global.modsConfig) {
        if (!element.enabled) {
            continue;
        }

        let filepath = getModFilepath(element);
        let mod = json.readParsed(filepath + "mod.config.json");
		if(!mod.lateExecute)
			loadMod(mod, filepath);
    }
}
// flush
function flush() {
    db = {};
    res = {};
}
// dump
function dump() {
	if(json.exist("db/"))
		json.write("user/cache/db.json", db);
    json.write("user/cache/res.json", res);
}
// scanRecursiveRoute
function scanRecursiveRoute(filepath, deep = false) {
	if(filepath == "db/")
		if(!json.exist("db/"))
			return;
    let baseNode = {};
    let directories = utility.getDirList(filepath);
    let files = json.readDir(filepath);

    // remove all directories from files
    for (let directory of directories) {
        for (let file in files) {
            if (files[file] === directory) {
                files.splice(file, 1);
            }
        }
    }

    // make sure to remove the file extention
    for (let node in files) {
        let fileName = files[node].split('.').slice(0, -1).join('.');
        baseNode[fileName] = filepath + files[node];
    }

    // deep tree search
    for (let node of directories) {
		//if(node != "items" && node != "assort" && node != "customization" && node != "locales" && node != "locations" && node != "templates")
			baseNode[node] = scanRecursiveRoute(filepath + node + "/");
    }

    return baseNode;
}
// routeAll
function routeAll() {
	logger.logInfo("Rebuilding cache: route database");
	db = scanRecursiveRoute("db/");
	logger.logInfo("Rebuilding cache: route ressources");
    res = scanRecursiveRoute("res/");
    //json.write("user/cache/loadorder.json", json.read("src/loadorder.json"), true);

    /* add important server paths */
    db.user = {
        "configs": {
            "server": "user/config/server.json"
        },
        "events": {
            "schedule": "user/events/schedule.json"
        }   
    }
}
// all
exports.all = () => {
	// if somehow any of rebuildCache will be triggered do not check other things it will be recached anyway
	
    // create mods folder if missing
    if (!json.exist("user/mods/")) {
        json.mkDir("user/mods/");
    }
	if(!json.exist("./user/cache") || json.readDir("./user/cache").length < 31)
	{ // health number of cache file count is 31 as for now ;)
		logger.logError("Missing files! Rebuilding cache required!");
		serverConfig.rebuildCache = true;
	}
	if(!serverConfig.rebuildCache)
		detectMissingMods();

    /* check if loadorder is missing */
    /*if (!json.exist("user/cache/loadorder.json") && !serverConfig.rebuildCache) {
        logger.logWarning("Loadorder missing. Rebuild Required.")
        serverConfig.rebuildCache = true;
    }*/

    // detect if existing mods changed
    if (detectChangedMods() && !serverConfig.rebuildCache) {
        logger.logWarning("Modlist changed. Rebuild Required.");
        serverConfig.rebuildCache = true;
    }

    // check if db need rebuid
    if (isRebuildRequired() && !serverConfig.rebuildCache) {
        logger.logWarning("Rebuild is required!");
        serverConfig.rebuildCache = true;
    }

    // rebuild db
    if (serverConfig.rebuildCache) {
        logger.logWarning("Rebuilding cache system");
        
        flush();
        routeAll();
        detectMissingMods();
        dump();
    }
	
	loadAllMods();
	
    db = json.readParsed("user/cache/db.json");
    res = json.readParsed("user/cache/res.json");
}

exports.LateModLoad = () => {
    logger.logInfo("Executing LateModLoad Routes");
	for (let element of global.modsConfig) {
        if (!element.enabled) {
            continue;
        }
        let filepath = getModFilepath(element);
        let mod = json.readParsed(filepath + "mod.config.json");
		if(mod.lateExecute)
			loadMod(mod, filepath);
    }
}