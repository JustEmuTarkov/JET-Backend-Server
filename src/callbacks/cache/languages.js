"use strict";

function cache() {
    if (!serverConfig.rebuildCache) {
        return;
    }
    
    let base = {"err": 0, "errmsg": null, "data": []};

    for (let file in db.locales) {
        let fileData = json.parse(json.read(db.locales[file][file]));
        base.data.push(fileData);
    }

    json.write(db.user.cache.languages, base);
}

server.addCacheCallback("cacheLanguages", cache);