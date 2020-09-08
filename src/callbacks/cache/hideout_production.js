"use strict";

function cache() {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: hideout_production.json");

    let base = {"err": 0, "errmsg": null, "data": []};
    let inputFiles = db.hideout.production;

    for (let file in inputFiles) {
        let filePath = inputFiles[file];
        let fileData = json.parse(json.read(filePath));

        base.data.push(fileData);
    }

    json.write(db.user.cache.hideout_production, base);
}

server.addCacheCallback("cacheHideoutProduction", cache);