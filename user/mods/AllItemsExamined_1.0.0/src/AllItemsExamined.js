exports.mod = (mod_info) => {
	logger.logInfo("[MOD] AllItemsExamined");
	
	// For some reason, the below is overwritten by the server at some point.
    for (let item in global._database.items) {
        let data = global._database.items[item];
		if(data._props.ExaminedByDefault == false){
			data._props.ExaminedByDefault = true;
			global._database.items[item] = data;
		}
	}

	// This will examine them all through the cache, which should work. - kiobu
	let file = fileIO.readParsed(global.db.user.cache.items)
	for (let k in file.data) {
		if (!file.data[k].ExaminedByDefault) { file.data[k]._props.ExaminedByDefault = true; }
	}
	fileIO.write(global.db.user.cache.items, file)

	logger.logSuccess("[MOD] AllItemsExamined; Applied");
}