"use strict";

function cache() {
    if (!serverConfig.rebuildCache) {
        return;
    }

    /* assort */
    for (let trader in db.assort) {
        logger.logInfo("Caching: assort_" + trader + ".json");

        let base = {"err": 0, "errmsg": null, "data": {"items": [], "barter_scheme": {}, "loyal_level_items": {}}};
        let inputNode = db.assort[trader];
        let inputDir = [
            "items",
            "barter_scheme",
            "loyal_level_items"
        ];

        for (let path in inputDir) {
            let inputFiles = inputNode[inputDir[path]];
            let inputNames = Object.keys(inputFiles);
            let i = 0;

            for (let file in inputFiles) {
                let filePath = inputFiles[file];
                let fileName = inputNames[i++];
                let fileData = json.parse(json.read(filePath));

                if (path == 0) {
                    base.data.items.push(fileData);
                } else if (path == 1) {
                    base.data.barter_scheme[fileName] = fileData;
                } else if (path == 2) {
                    base.data.loyal_level_items[fileName] = fileData;
                }
            }
        }

        json.write(db.user.cache[`assort_${trader}`], base);
    }

    /* customization */
    for (let trader in db.assort) {
        if ("customization" in db.assort[trader]) {
            logger.logInfo("Caching: customization_" + trader + ".json");

            let base = [];

            for (let file in db.assort[trader].customization) {
                base.push(json.parse(json.read(db.assort[trader].customization[file])));
            }

            json.write(db.user.cache[`customization_${trader}`], base);
        }
    }
}

server.addCacheCallback("cacheAssort", cache);