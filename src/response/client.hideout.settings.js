function execute(url, info, sessionID){
	return json.read(db.hideout.settings);
}
exports.execute = execute;