function execute(url, info, sessionID){
	return response_f.getBody(weaponbuilds_f.getUserBuilds(sessionID));
}
exports.execute = execute;