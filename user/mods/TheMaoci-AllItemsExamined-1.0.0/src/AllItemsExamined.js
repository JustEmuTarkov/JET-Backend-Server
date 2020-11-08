exports.mod = () => {
    logger.logInfo("[MOD] AllItemsExamined");
    for (let item in global._Database.items) {
        let data = global._Database.items[item];
		if(data._props.ExaminedByDefault == false){
			data._props.ExaminedByDefault = true;
			global._Database.items[item] = data;
		}
    }
	logger.logSuccess("[MOD] AllItemsExamined; Applied");
}