exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: hideout_scavcase.json");

    let base = {"err": 0, "errmsg": null, "data": []};
    let inputFiles = db.hideout.scavcase;

    for (let file in inputFiles) {
        let filePath = inputFiles[file];
        let fileData = json.parse(json.read(filePath));

        base.data.push(fileData);
    }

    json.write("user/cache/hideout_scavcase.json", base);
}