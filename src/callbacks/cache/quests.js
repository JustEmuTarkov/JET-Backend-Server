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
        if (!("quests" in db.assort[trader])) {
            continue;
        }
        let data = json.parse(json.read(db.assort[trader].quests));
		for(let quest in data){
			base.data.push(data[quest]);
		}
    }
    json.write(db.user.cache.quests, base);
}

server.addCacheCallback("cacheQuests", cache);