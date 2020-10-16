function execute(url, info, sessionID){
	return response_f.getBody(weaponBuilds_f.getUserBuilds(sessionID));
}
exports.execute = execute;