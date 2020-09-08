"use strict";

function cache() {
    if (!serverConfig.rebuildCache) {
        return;
    }
    
    logger.logInfo("Caching: templates.json");

    let base = {"err": 0, "errmsg": null, "data": {"Categories": [], "Items": []}};
    let inputDir = [
        "categories",
        "items"
    ];

    for (let path in inputDir) {
        let inputFiles = db.templates[inputDir[path]];

        for (let file in inputFiles) {
            let filePath = inputFiles[file];
            let fileData = json.parse(json.read(filePath));

            if (path == 0) {
                base.data.Categories.push(fileData);
            } else {
                base.data.Items.push(fileData);
            }
        }
    }

    json.write(db.user.cache.templates, base);
}

server.addCacheCallback("cacheTemplates", cache);