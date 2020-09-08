"use strict";

function cache() {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: items.json");

    let base = {"err": 0, "errmsg": null, "data": {}};
    let inputFiles = db.items;
    for (let file in inputFiles) {
        let filePath = inputFiles[file];
        let NodeFileData = json.parse(json.read(filePath));
		for (let items of NodeFileData)
		{
			base.data[items._id] = items;
		}
    }

    json.write(db.user.cache.items, base);
}

server.addCacheCallback("cacheItems", cache);