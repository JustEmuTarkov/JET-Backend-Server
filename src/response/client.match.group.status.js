function execute(url, info, sessionID){
	return response_f.getBody(match_f.handler.getGroupStatus(info));
}
exports.execute = execute;