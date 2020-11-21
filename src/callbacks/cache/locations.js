exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }
	logger.logInfo("Caching: locations.json");
	let locations = {};
	for (let name in db.locations) {
		if (name === "base") {
			continue;
		}
		
		let node = fileIO.readParsed(db.locations[name]);
		let location = node.base;

		// set infill locations
		//for (let entry in node.entries) {
		//	location.SpawnAreas.push(fileIO.readParsed(node.entries[entry]));
		//}

		// set exfill locations
		//for (let exit in node.exits) {
		//	location.exits.push(fileIO.readParsed(node.exits[exit]));
		//}

		// set scav locations
		//for (let wave in node.waves) {
		//	location.waves.push(fileIO.readParsed(node.waves[wave]));
		//}

		// set boss locations
		//for (let spawn in node.bosses) {
		//	location.BossLocationSpawn.push(fileIO.readParsed(node.bosses[spawn]));
		//}

		locations[name] = location;
	}
	fileIO.write("user/cache/locations.json", locations);
}