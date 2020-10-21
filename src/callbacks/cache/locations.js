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
		
		let node = json.readParsed(db.locations[name]);
		let location = node.base;

		// set infill locations
		//for (let entry in node.entries) {
		//	location.SpawnAreas.push(json.readParsed(node.entries[entry]));
		//}

		// set exfill locations
		//for (let exit in node.exits) {
		//	location.exits.push(json.readParsed(node.exits[exit]));
		//}

		// set scav locations
		//for (let wave in node.waves) {
		//	location.waves.push(json.readParsed(node.waves[wave]));
		//}

		// set boss locations
		//for (let spawn in node.bosses) {
		//	location.BossLocationSpawn.push(json.readParsed(node.bosses[spawn]));
		//}

		locations[name] = location;
	}
	json.write("user/cache/locations.json", locations);
}