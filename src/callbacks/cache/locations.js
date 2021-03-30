exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }
	logger.logInfo("Caching: locations.json");
	let locations = {};
	for (let name in db.locations.base) {
		let _location = { "base": {}, "loot": {}};
		_location.base = fileIO.readParsed(db.locations.base[name]);
		if(typeof db.locations.loot[name] != "undefined")
			_location.loot = fileIO.readParsed(db.locations.loot[name]);
		locations[name] = _location;
	}
	fileIO.write("user/cache/locations.json", locations);
}