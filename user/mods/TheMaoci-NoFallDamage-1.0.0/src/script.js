exports.mod = (mod_info) => {
    logger.logInfo("[MOD] NoFallDamage");
	
	global._database.globals.config.Health.Falling.DamagePerMeter = 0;
	global._database.globals.config.Health.Falling.SafeHeight = 999;
	
	logger.logSuccess("[MOD] NoFallDamage; Applied");
}