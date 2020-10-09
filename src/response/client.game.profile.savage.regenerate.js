function execute(url, info, sessionID){
	return response_f.getBody([profile_f.profileServer.generateScav(sessionID)]);
}
exports.execute = execute;