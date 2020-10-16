exports.cache = () => {
    if (serverConfig.rebuildCache) {
        logger.logInfo("Caching: mods.json");    
        json.write("user/cache/mods.json", modsConfig);
    }
}