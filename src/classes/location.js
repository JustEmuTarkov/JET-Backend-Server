"use strict";
const fs = require('fs');

/* LocationServer class maintains list of locations in memory. */
class LocationServer {
    constructor() {
        this.locations = {};
    }

    /* Load all the locations into memory. */
    initialize() {
		this.locations = json.parse(json.read(db.user.cache.locations));
    }

    /* generates a random location preset to use for local session */
    generate(name) {
		//check if one file loot is existing
        let output = this.locations[name];
		
		if(!utility.isUndefined(db.locations[name].loot_file))
			if(json.exist(db.locations[name].loot_file))
			{
				let data = json.parse(json.read(db.locations[name].loot_file));
				// maybe adding some random ID's for loot wil need to think about it
				output.Loot = data.Loot;
				logger.logSuccess(`[Generate] For location: ${name}`);
				let displayCount = "";
				if(typeof output.Loot.Static != "undefined")
					displayCount += `[static]${output.Loot.Static.length}`;
				if(typeof output.Loot.Dynamic != "undefined")
					displayCount += `[dynamic]${output.Loot.Dynamic.length}`;
				if(typeof output.Loot.Forced != "undefined")
					displayCount += `[forced]${output.Loot.Forced.length}`;
				
				logger.logSuccess(displayCount);
				return output;
			}
		
    }

    /* get a location with generated loot data */
    get(Location) {
        let name = Location.toLowerCase().replace(" ", "");
        return this.generate(name);
    }

    /* get all locations without loot data */
    generateAll() {
		// lets try to read from cache
		if(!utility.isUndefined(db.user.cache.locations))
		{
			if(json.exist(db.user.cache.locations))
			{
				//console.log(db.cacheBase.locations);
				let base = json.parse(json.read(db.cacheBase.locations))
				let data = json.parse(json.read(db.user.cache.locations));
				let newData = {};
				for(let location in data){
					newData[data[location]._Id] = data[location];
				}
				base.data.locations = newData;
				return base.data;
			}
			logger.logError(`What the fuck did you put into db.user.cache.locations: ${db.user.cache.locations}`);
		}
		throw "USE A FUCKING CACHE SYSTEM U MORON!!";
    }
}

module.exports.locationServer = new LocationServer();