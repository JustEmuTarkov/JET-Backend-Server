function execute(url, info, sessionID){
	return json.read(db.user.cache.hideout_production);
}
exports.execute = execute;