function execute(url, info, sessionID){
	return response_f.getBody(trader_f.traderServer.getAllTraders(sessionID));
}
exports.execute = execute;