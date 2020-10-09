function execute(url, info, sessionID){
	return response_f.getBody(account_f.accountServer.getReservedNickname(sessionID));
}
exports.execute = execute;