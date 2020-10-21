function execute(url, info, sessionID){
	return response_f.getBody(trader_f.handler.getTrader(url.replace("/client/trading/api/getTrader/", ""), sessionID));
}
exports.execute = execute;