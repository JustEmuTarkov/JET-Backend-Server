exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: [MOD] AllItemsExamined");

    let base = json.readParsed(db.user.cache.items);

    for (let file in base.data) {
        let data = base.data[file];
        data._props.ExaminedByDefault = true;
        base.data[file] = data;
    }

    json.write(db.user.cache.items, base);
}