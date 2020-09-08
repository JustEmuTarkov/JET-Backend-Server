"use strict"

function cache() {
    if (serverConfig.rebuildCache) {
        logger.logInfo("Caching: mods.json");    
        json.write(db.user.cache.mods, modsConfig);
    }
}

server.addCacheCallback("cacheModlist", cache);