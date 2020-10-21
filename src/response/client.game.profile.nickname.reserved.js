function execute(url, info, sessionID){
	return response_f.getBody(account_f.handler.getReservedNickname(sessionID));
}
exports.execute = execute;