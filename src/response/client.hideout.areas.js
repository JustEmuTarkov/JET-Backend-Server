function execute(url, info, sessionID){
	return json.read(db.user.cache.hideout_areas);
}
exports.execute = execute;