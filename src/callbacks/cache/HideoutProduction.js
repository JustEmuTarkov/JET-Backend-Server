exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: hideout_production.json");

    let base = {"err": 0, "errmsg": null, "data": []};
    let inputFiles = db.hideout.production;

    for (let file in inputFiles) {
        let filePath = inputFiles[file];
        let fileData = json.readParsed(filePath);

        base.data.push(fileData);
    }

    json.write("user/cache/hideout_production.json", base);
}