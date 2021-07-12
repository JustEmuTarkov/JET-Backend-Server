exports.mod = (mod_info) => {
    logger.logInfo("[MOD] LessWeightItems");
    for (let item in global._database.items) {
		if(mod_info.configuration.NoWeight){
			if(typeof global._database.items[item]._props.Weight != "undefined"){
				global._database.items[item]._props.Weight = 0;
			}
		} 
		if(mod_info.configuration.ClampWeight){
			if(typeof global._database.items[item]._props.Weight != "undefined"){
				if(global._database.items[item]._props.Weight >= mod_info.configuration.ClampWeightAbove)
				global._database.items[item]._props.Weight = mod_info.configuration.ClampWeightAbove;
			}
		}
    }
	logger.logSuccess("[MOD] LessWeightItems; Applied");
}