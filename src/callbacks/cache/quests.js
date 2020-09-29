"use strict";

function cache() {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: quests");

    let base = {"err": 0, "errmsg": null, "data": []};
    /* assort */
	//base.data = db.assort;
    for (let trader in db.assort) {
        if (typeof db.assort[trader].quests == "undefined")
            continue;
		if(typeof db.assort[trader].quests == "object")
			throw "db.assort[trader].quests isnt a path";
		
        let data = json.parse(json.read(db.assort[trader].quests));
		for(let quest in data){
			base.data.push(data[quest]);
		}
    }
    json.write(db.user.cache.quests, base);
}

server.addCacheCallback("cacheQuests", cache);