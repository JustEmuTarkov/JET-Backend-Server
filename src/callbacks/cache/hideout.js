exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

	for(let type in db.hideout){
		if(type == "settings") continue;
		logger.logInfo(`Caching: hideout_${type}.json`);
		let base = {"err": 0, "errmsg": null, "data": []};
		let inputFiles = db.hideout[type];
		for (let file in inputFiles) {
			let filePath = inputFiles[file];
			let fileData = fileIO.readParsed(filePath);

			base.data.push(fileData);
		}
		fileIO.write(`user/cache/hideout_${type}.json`, base, true, false);
	}
}