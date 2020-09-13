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
        let output = this.locations[name];
        let ids = {};
        let base = {};

        // don't generate loot on hideout
        if (name === "hideout") {
            return output;
        }

        // forced loot
        base = db.locations[name].loot.forced;

        for (let dir in base) {
            for (let loot in base[dir]) {
                let data = json.parse(json.read(base[dir][loot]));

                if (data.Id in ids) {
                    continue;
                } else {
                    ids[data.Id] = true;
                }

                output.Loot.push(data);
            }
        }

        // static loot
        base = db.locations[name].loot.static;

        for (let dir in base) {
            let node = base[dir];
            let keys = Object.keys(node);
            let data = json.parse(json.read(node[keys[utility.getRandomInt(0, keys.length - 1)]]));

            if (data.Id in ids) {
                continue;
            } else {
                ids[data.Id] = true;
            }
            output.Loot.push(data);
        }

        // dyanmic loot
        let dirs = Object.keys(db.locations[name].loot.dynamic);
        let max = gameplayConfig.locationloot[name];
        let count = 0;

        base = db.locations[name].loot.dynamic;

        //Generate dynamic loot list
        let lootFiles = {};
        for (const dir of dirs) {
            for (const lootFileName of Object.keys(base[dir])) {
                lootFiles[dir + "_" + lootFileName] = base[dir][lootFileName];
            }
        }

        //Loot position list for filtering the lootItem in the same position.
        let lootPositions = [];
        var maxCount = 0;
        while (maxCount < max && Object.keys(lootFiles).length > 0) {
            maxCount += 1;
            let keys = Object.keys(lootFiles);
            let key = keys[utility.getRandomInt(0, keys.length - 1)];
            let data = json.parse(json.read(lootFiles[key]));
            
            //Check if LootItem is overlapping
            let position = data.Position.x + "," + data.Position.y + "," + data.Position.z;
            if(!gameplayConfig.locationloot.allowLootOverlay && lootPositions.includes(position)) {
                //Clearly selected loot
                delete lootFiles[key];
                continue;
            }

            //random loot Id
            //TODO: To implement a new random function, use "generateNewItemId" instead for now.
            data.Id = utility.generateNewItemId();

            //create lootItem list 
            let lootItemsHash = {};
            let lootItemsByParentId = {};
            
           

            for (const i in data.Items) {
                
                let loot = data.Items[i];
                // Check for the item spawnchance
                lootItemsHash[loot._id] = loot;            

                if (!("parentId" in loot))
                    continue;

                if(lootItemsByParentId[loot.parentId] == undefined)
                    lootItemsByParentId[loot.parentId] = [];
                    lootItemsByParentId[loot.parentId].push(loot)
            }
            //reset itemId and childrenItemId
            for (const itemId of Object.keys(lootItemsHash)) {
                let newId = utility.generateNewItemId();
                lootItemsHash[itemId]._id = newId;

                if(itemId == data.Root)
                    data.Root = newId;

                if(lootItemsByParentId[itemId] == undefined) 
                    continue;
                
                for (const childrenItem of lootItemsByParentId[itemId]) {
                    childrenItem.parentId = newId;
                }
            }
            const num = utility.getRandomInt(0,100);
            const itemChance = (items.data[data.Items[0]._tpl]._props.SpawnChance * globals.data.config.GlobalLootChanceModifier * location_f.locationServer.locations[name].GlobalLootChanceModifier).toFixed(0);
            if(itemChance >= num){
                count += 1;
                lootPositions.push(position);
                output.Loot.push(data);
            }else{
                continue;
            }
            
        }

        // done generating
        logger.logSuccess(`A total of ${count} items spawned`);
        logger.logSuccess(`Generated location ${name}`);
        return output;
    }

    /* get a location with generated loot data */
    get(location) {
        let name = location.toLowerCase().replace(" ", "");
        return json.stringify(this.generate(name));
    }

    /* get all locations without loot data */
    generateAll() {
		// lets try to read from cache
		if(typeof db.user.cache.locations != "undefined")
		{
			if(json.exist(db.user.cache.locations))
			{
				console.log(db.cacheBase.locations);
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