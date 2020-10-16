function execute(url, info, sessionID){
	return json.read(db.user.cache.hideout_scavcase);
}
exports.execute = execute;