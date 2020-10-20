"use strict";

/* LocationServer class maintains list of locations in memory. */
class LocationServer {
    constructor() {
        this.locations = {};
		this.location = {};
		this.loot = {};
    }

    /* Load all the locations into memory. */
    initialize() {
		this.locations = json.readParsed(db.user.cache.locations);
		this.loot = json.readParsed(db.cacheBase.location_statics);
    }

    /* generates a random location preset to use for local session */
    generate(name) {
		//check if one file loot is existing
        //let output = this.locations[name];
		
		// dont read next time ??
		this.location = json.readParsed(db.locations[name]);
		
        const locationLootChanceModifier = this.location.base.GlobalLootChanceModifier;
        let output = this.location.base;
        let ids = {};

        // don't generate loot on hideout
        if (name === "hideout")
        {
            return output;
        }

        let forced = this.location.loot.forced;
        let mounted = this.location.loot.mounted;
        let statics = this.location.loot.static;
        let dynamic = this.location.loot.dynamic;
        output.Loot = [];

        let count = 0;
		let counters = [];
        // mounted weapons
        for (let i in mounted)
        {
            let data = mounted[i];

            if (data.Id in ids)
                continue;

            ids[data.Id] = true;
            output.Loot.push(data);
			count++;
        }
		counters.push(count);
        //logger.logSuccess("A total of " + count + " weapons generated");
		count = 0;
		// forced loot
        for (let i in forced)
        {
            let data = forced[i].data[0];

            if (data.Id in ids)
                continue;

            ids[data.Id] = true;
            output.Loot.push(data);
			count++;
        }
		counters.push(count);
        //logger.logSuccess("A total of " + count + " forcedLoot generated");
        count = 0;
        // static loot
        for (let i in statics)
        {
            let data = statics[i];

            if (data.Id in ids)
                continue;

            ids[data.Id] = true;

            if (data.Items.length > 1)
                data.Items.splice(1);

            this.generateContainerLoot(data.Items);
            output.Loot.push(data);
            count++;
        }
		counters.push(count);
        //logger.logSuccess("A total of " + count + " containers generated");

        // dyanmic loot
        let max = 2000;//location_f.config.limits[name];
        count = 0;

        // Loot position list for filtering the lootItem in the same position.
        let lootPositions = [];
        let maxCount = 0;

        while (maxCount < max && dynamic.length > 0)
        {
            maxCount += 1;
            let rndLootIndex = utility.getRandomInt(0, dynamic.length - 1);
            let rndLoot = dynamic[rndLootIndex];

            if (!rndLoot.data)
            {
                maxCount -= 1;
                continue;
            }

            let rndLootTypeIndex = utility.getRandomInt(0, rndLoot.data.length - 1);
            let data = rndLoot.data[rndLootTypeIndex];

            //Check if LootItem is overlapping
            let position = data.Position.x + "," + data.Position.y + "," + data.Position.z;
            if (!gameplayConfig.locationloot.allowLootOverlay && lootPositions.includes(position))
            {
                //Clear selected loot
                dynamic[rndLootIndex].data.splice(rndLootTypeIndex, 1);

                if (dynamic[rndLootIndex].data.length === 0)
                {
                    delete dynamic.splice(rndLootIndex, 1);
                }

                continue;
            }

            //random loot Id
            //TODO: To implement a new random function, use "generateID" instead for now.
            data.Id = utility.generateNewItemId();

            //create lootItem list
            let lootItemsHash = {};
            let lootItemsByParentId = {};

            for (const i in data.Items)
            {

                let loot = data.Items[i];
                // Check for the item spawnchance
                lootItemsHash[loot._id] = loot;

                if (!("parentId" in loot))
                    continue;

                if (lootItemsByParentId[loot.parentId] === undefined)
                    lootItemsByParentId[loot.parentId] = [];
                lootItemsByParentId[loot.parentId].push(loot);
            }

            //reset itemId and childrenItemId
            for (const itemId of Object.keys(lootItemsHash))
            {
                let newId = utility.generateNewItemId();
                lootItemsHash[itemId]._id = newId;

                if (itemId === data.Root)
                    data.Root = newId;

                if (lootItemsByParentId[itemId] === undefined)
                    continue;

                for (const childrenItem of lootItemsByParentId[itemId])
                {
                    childrenItem.parentId = newId;
                }
            }

            const num = utility.getRandomInt(0, 100);
            const spawnChance = helper_f.getItem(data.Items[0]._tpl)[1]['_props']['SpawnChance'];
            const itemChance = (spawnChance * locationLootChanceModifier).toFixed(0);
            if (itemChance >= num)
            {
                count += 1;
                lootPositions.push(position);
                output.Loot.push(data);
            }
            else
            {
                continue;
            }
        }

        // done generating
        logger.logSuccess(`Generated location ${name} with ${count} items spawned [$[Weapon: ${counters[0]} | FreeLayItem: ${counters[1]} | Container: ${counters[2]}]]`);
		counters = null;
        return output;
    }
	getStaticLoot(_tpl){
		for(let obj of this.location.loot.static){
			if(obj.Items[0]._tpl == _tpl)
				return obj;
		}
	}
	// TODO: rework required - weard functions to replace later on ;)
	generateContainerLoot(_items) {
		// REWRITE IT TO TAKE ADVANTAGE OF items.json over some retarded bilion additional files
        let container = this.loot[_items[0]._tpl];
        let parentId = _items[0]._id;
        let idPrefix = parentId.substring(0, parentId.length - 4);
        let idSuffix = parseInt(parentId.substring(parentId.length - 4), 16) + 1;
        let container2D = Array(container.height).fill().map(() => Array(container.width).fill(0));
		
        let maxProbability = container.maxProbability;
        let minCount = container.minCount;

        for (let i = minCount; i < container.maxCount; i++)
        {
            let roll = utility.getRandomInt(0, 100);

            if (roll < container.chance)
            {
                minCount++;
            }
        }

        for (let i = 0; i < minCount; i++)
        {
            let item = {};
            let containerItem = {};
            let result = { success: false };
            let maxAttempts = 20;

            while (!result.success && maxAttempts)
            {
                let roll = utility.getRandomInt(0, maxProbability);
                let rolled = container.items.find(itm => itm.cumulativeChance >= roll);

                item = helper_f.getItem(rolled.id)[1];

                if (rolled.preset)
                {
                    // Guns will need to load a preset of items
                    item._props.presetId = rolled.preset.id;
                    item._props.Width = rolled.preset.w;
                    item._props.Height = rolled.preset.h;
                }

                result = helper_f.findSlotForItem(container2D, item._props.Width, item._props.Height);
                maxAttempts--;
            }

            // if we weren't able to find an item to fit after 20 tries then container is probably full
            if (!result.success)
                break;

            container2D = helper_f.fillContainerMapWithItem(
                container2D, result.x, result.y, item._props.Width, item._props.Height, result.rotation);
            let rot = result.rotation ? 1 : 0;

            if (item._props.presetId)
            {
                // Process gun preset into container items
                let preset = helper_f.getPreset(item._id);
				if(preset == null) continue;
                preset._items[0].parentId = parentId;
                preset._items[0].slotId = "main";
                preset._items[0].location = { "x": result.x, "y": result.y, "r": rot};

                for (var p in preset._items)
                {
                    _items.push(preset._items[p]);

                    if (preset._items[p].slotId === "mod_magazine")
                    {
                        let mag = helper_f.getItem(preset._items[p]._tpl)[1];
                        let cartridges = {
                            "_id": idPrefix + idSuffix.toString(16),
                            "_tpl": item._props.defAmmo,
                            "parentId": preset._items[p]._id,
                            "slotId": "cartridges",
                            "upd": { "StackObjectsCount": mag._props.Cartridges[0]._max_count }
                        };

                        _items.push(cartridges);
                        idSuffix++;
                    }
                }

                continue;
            }

            containerItem = {
                "_id": idPrefix + idSuffix.toString(16),
                "_tpl": item._id,
                "parentId": parentId,
                "slotId": "main",
                "location": { "x": result.x, "y": result.y, "r": rot}
            };

            let cartridges;
            if (item._parent === "543be5dd4bdc2deb348b4569" || item._parent === "5485a8684bdc2da71d8b4567")
            {
                // Money or Ammo stack
                let stackCount = utility.getRandomInt(item._props.StackMinRandom, item._props.StackMaxRandom);
                containerItem.upd = { "StackObjectsCount": stackCount };
            }
            else if (item._parent === "543be5cb4bdc2deb348b4568")
            {
                // Ammo container
                idSuffix++;

                cartridges = {
                    "_id": idPrefix + idSuffix.toString(16),
                    "_tpl": item._props.StackSlots[0]._props.filters[0].Filter[0],
                    "parentId": containerItem._id,
                    "slotId": "cartridges",
                    "upd": { "StackObjectsCount": item._props.StackMaxRandom }
                };
            }
            else if (item._parent === "5448bc234bdc2d3c308b4569")
            {
                // Magazine
                idSuffix++;
                cartridges = {
                    "_id": idPrefix + idSuffix.toString(16),
                    "_tpl": item._props.Cartridges[0]._props.filters[0].Filter[0],
                    "parentId": parentId,
                    "slotId": "cartridges",
                    "upd": { "StackObjectsCount": item._props.Cartridges[0]._max_count }
                };
            }

            _items.push(containerItem);
			
            if (cartridges)
                _items.push(cartridges);
			
            idSuffix++;
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
				let base = json.readParsed(db.cacheBase.locations);
				let data = json.readParsed(db.user.cache.locations);
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