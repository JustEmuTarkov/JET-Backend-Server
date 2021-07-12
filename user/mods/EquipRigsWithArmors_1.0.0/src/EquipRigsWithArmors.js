exports.mod = (mod_info) => {
    logger.logInfo("[MOD] EquipRigsWithArmors");
    for (let item in global._database.items) {
        let data = global._database.items[item];
		if(typeof data._props.BlocksArmorVest != "undefined"){
			data._props.BlocksArmorVest = false;
		}
    }
	logger.logSuccess("[MOD] EquipRigsWithArmors; Applied");
}