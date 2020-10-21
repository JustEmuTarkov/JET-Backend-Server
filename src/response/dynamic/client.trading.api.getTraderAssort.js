function execute(url, info, sessionID){
	return response_f.getBody(trader_f.handler.getAssort(sessionID, url.replace("/client/trading/api/getTraderAssort/", "")));
}
exports.execute = execute;