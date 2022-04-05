exports.mod = (mod_info) => {
	logger.logInfo("[MOD] AllItemsExamined");
	//console.log(global._database.items);
	// For some reason, the below is overwritten by the server at some point.
    for (let item in global._database.items) {
        let data = global._database.items[item];
		if(data._props.ExaminedByDefault == false){
			data._props.ExaminedByDefault = true;
			global._database.items[item] = data;
		}
	}

	logger.logSuccess("[MOD] AllItemsExamined; Applied");
}