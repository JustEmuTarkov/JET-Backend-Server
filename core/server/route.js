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
// detectChangedMods
function detectChangedMods() {
    let changed = false;

    for (let mod of modsConfig) {
        if (!fileIO.exist(getModFilepath(mod) + "mod.config.json")) {
            changed = true;
            break;
        }
        let config = fileIO.readParsed(getModFilepath(mod) + "/mod.config.json");

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
    if (!fileIO.exist("user/mods/")) {
        return;
    }

    let dir = "user/mods/";
    let mods = utility.getDirList(dir);

    for (let mod of mods) {
        /* check if config exists */
        if (!fileIO.exist(dir + mod + "/mod.config.json")) {
            logger.logError(`Mod ${mod} is missing mod.config.json`);
            continue;
			// continue starting server only with displaying error that mod wasnt loaded properly
        }

        let config = fileIO.readParsed(dir + mod + "/mod.config.json");
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
            fileIO.write("user/configs/mods.json", modsConfig);
        }
    }
}
// isRebuildRequired
function isRebuildRequired() {
    if (!fileIO.exist("user/cache/mods.json")
    || !fileIO.exist("user/cache/db.json")
    || !fileIO.exist("user/cache/res.json")) {
        return true;
    }

    let cachedlist = fileIO.readParsed("user/cache/mods.json");

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
// loadMod
function loadMod(mod, filepath, LoadType) {
	let modName = `${mod.author}-${mod.name}-${mod.version}`;
	if(typeof mod.src != "undefined")
		for(let srcToExecute in mod.src){
			if(mod.src[srcToExecute] == LoadType){
				let path = `../../user/mods/${modName}/${srcToExecute}`;
				
				let ModScript = require(path).mod;
				
				ModScript(mod); // execute mod
			}
		}
}
function loadModSrc(mod, filepath){
	if(typeof mod.res != "undefined")
		res = scanRecursiveMod(filepath, res, mod.res);
}


exports.CacheModLoad = () => {
    for (let element of global.modsConfig) {
        if (!element.enabled) {
            continue;
        }

        let filepath = getModFilepath(element);
        let mod = fileIO.readParsed(filepath + "mod.config.json");
		loadMod(mod, filepath, "CacheModLoad");
    }
	
}
exports.ResModLoad = () => {
    for (let element of global.modsConfig) {
        if (!element.enabled) {
            continue;
        }
        let filepath = getModFilepath(element);
        let mod = fileIO.readParsed(filepath + "mod.config.json");
		loadModSrc(mod, filepath)
    }
	
}
exports.TamperModLoad = () => {
    logger.logInfo("Executing LateModLoad Routes");
	for (let element of global.modsConfig) {
        if (!element.enabled) {
            continue;
        }
        let filepath = getModFilepath(element);
        let mod = fileIO.readParsed(filepath + "mod.config.json");
		loadMod(mod, filepath, "TamperModLoad");
    }
}


// flush
function flush() {
    db = {};
    res = {};
}
// dump
function dump() {
	if(fileIO.exist("db/"))
		fileIO.write("user/cache/db.json", db);
    fileIO.write("user/cache/res.json", res);
}
// scanRecursiveRoute
function scanRecursiveRoute(filepath, deep = false) {
	if(filepath == "db/")
		if(!fileIO.exist("db/"))
			return;
    let baseNode = {};
    let directories = utility.getDirList(filepath);
    let files = fileIO.readDir(filepath);

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
    //fileIO.write("user/cache/loadorder.json", fileIO.read("src/loadorder.json"), true);

    /* add important server paths */
    db.user = {
        "configs": {
            "server": "user/configs/server.json"
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
    if (!fileIO.exist("user/mods/")) {
        fileIO.mkDir("user/mods/");
    }
	if(!fileIO.exist("./user/cache") || fileIO.readDir("./user/cache").length < 31)
	{ // health number of cache file count is 31 as for now ;)
		logger.logError("Missing files! Rebuilding cache required!");
		serverConfig.rebuildCache = true;
	}
	
	// Loading mods (without execute)
	let emptyModsConfig = false;
	if(!fileIO.exist("user/configs/mods.json")){
		fileIO.write("user/configs/mods.json", {});
		emptyModsConfig = true;
	}
	// -- need to be mored to functions later on !!!
	
	let modsConfig = {};
	let modsRequirements = {}
	if(emptyModsConfig){
		const modsFolder = fileIO.readDir("user/mods").filter(dir => dir.isDirectory());
		for(const modFolder of modsFolder){
			const modConfig = fileIO.readParsed(`user/mods/${modFolder}/mod.config.json`);
			if(typeof modConfig.name != "undefined" && typeof modConfig.name != "string")
			{
				if(modConfig.author != "undefined" && typeof modConfig.author != "string")
				{
					if(modConfig.version != "undefined" && typeof modConfig.version != "string")
					{
						if(modConfig.required != "undefined")
						{
							const modUniqueID = `${modConfig.name}-${modConfig.version}_${modConfig.author}`;
							modsConfig[modUniqueID] = {
								"isEnabled": true,
								"folder": modFolder,
								"order": -1
							};
							modsRequirements[modUniqueID] = modConfig.required;
							
						} else {
							logger.logWarning(`requirements for a mod ${modFolder} are missing`);
						}
					} else {
						logger.logWarning("mod config version is undefined or is not a string, of mod: " + modFolder);
					}
				} else {
					logger.logWarning("mod config author is undefined or is not a string, of mod: " + modFolder);
				}
			} else {
				logger.logWarning("mod config name is undefined or is not a string, of mod: " + modFolder);
			}
		}
		fileIO.write("user/configs/mods.json", modsConfig);
	} else {
		modsConfig = fileIO.readParsed(`user/configs/mods.json`);
		for(let modKey in modsConfig){
			const modInfo = modsConfig[modKey];
			const modConfig = fileIO.readParsed(`user/mods/${modInfo.folder}/mod.config.json`);
			const modUniqueID = `${modConfig.name}-${modConfig.version}_${modConfig.author}`;
			modsRequirements[modUniqueID] = modConfig.required;
			// unfinished
		}
	}
	
	let orderNumber = 1;
	let AlreadyQueriedMods = [];
	// first loop with no requirements
	for(const key in modsRequirements){
		const modRequired = modsRequirements[key];
		if(modRequired.length == 0){
			modsConfig[key].order = orderNumber;
			orderNumber++;
			AlreadyQueriedMods.push({ "name": modsConfig[key].name, "ver": modsConfig[key].version.split('.') });
			delete modsRequirements[key];
		}
	}
	// lets check requirements of first mod requirements
	for(const key in modsRequirements){
		const modRequired = modsRequirements[key];
		if(modRequired.length == 1){
			const foundMods = AlreadyQueriedMods.map(mod => mod.name == modConfig.required[0].name);
			if(foundMods.length == 0)
			{
				logger.logWarning(`Mod: ${modConfig.name} failed to load cause of missing required mods`);
				delete modsRequirements[key];
				continue;
			}
			if(foundMods.length > 1){
				logger.logWarning(`Mod: ${modConfig.name} found more then 1 required mod with the same name!!! will take first one for checking`);
			}
			let versionComparison = "equal";
			let versionOfReqMod = modConfig.required[0].ver;
			
			if(versionOfReqMod.substring(0,1) == "^"){
				versionComparison = "newEqual";
				versionOfReqMod = versionOfReqMod.substring(1);
			}
			switch(versionComparison){
				case "equal": 
					if(foundMods[0].ver != versionOfReqMod)
					{
						logger.logWarning(`Mod: ${modConfig.name} failed to load cause of wrong version not "equal" to the required one`);
						delete modsRequirements[key];
						continue;
					}
				break;
				case "newEqual": 
					if(foundMods[0].ver != versionOfReqMod)
					{
						const requiredVersion = versionOfReqMod.split('.');
						const foundVersion = foundMods[0].ver.split('.');
						if(
							requiredVersion[0] < foundVersion[0] || 
							requiredVersion[1] < foundVersion[1] || 
							requiredVersion[2] < foundVersion[2])
						{
							logger.logWarning(`Mod: ${modConfig.name} failed to load cause of wrong version not "equal" or newer to the required one`);
							delete modsRequirements[key];
							continue;
						}
					}
				break;
			}
			// all is good we can add the mod
			modsConfig[key].order = orderNumber;
			orderNumber++;
			AlreadyQueriedMods.push({ "name": modsConfig[key].name, "ver": modsConfig[key].version.split('.') });
			delete modsRequirements[key];
		}
	}
	
		// unfinished// unfinished
	
	// end
	
	
	if(!serverConfig.rebuildCache)
		detectMissingMods();

    /* check if loadorder is missing */
    /*if (!fileIO.exist("user/cache/loadorder.json") && !serverConfig.rebuildCache) {
        logger.logWarning("Loadorder missing. Rebuild Required.")
        serverConfig.rebuildCache = true;
    }*/
	
	
	
	//const loadModOrder = 

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
	
    db = fileIO.readParsed("user/cache/db.json");
    res = fileIO.readParsed("user/cache/res.json");
}

