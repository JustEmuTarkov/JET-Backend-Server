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
        let _data = json.parse(json.read(db.templates[inputDir[path]]));
		if (path == 0) {
			base.data.Categories = _data;
		} else {
			base.data.Items = _data;
		}
    }

    json.write(db.user.cache.templates, base);
}

server.addCacheCallback("cacheTemplates", cache);