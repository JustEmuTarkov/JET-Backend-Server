function execute(url, info, sessionID){
	return response_f.getBody(match_f.matchServer.getGroupStatus(info));
}
exports.execute = execute;