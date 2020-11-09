exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: quests.json");
    let base = {"err": 0, "errmsg": null, "data": []};

    base.data = json.readParsed(db.templates.quests);
	
    json.write("user/cache/quests.json", base);
}