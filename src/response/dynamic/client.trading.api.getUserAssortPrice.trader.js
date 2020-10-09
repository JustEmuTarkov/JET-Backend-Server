function execute(url, info, sessionID){
	return response_f.getBody(trader_f.traderServer.getPurchasesData(url.substr(url.lastIndexOf('/') + 1), sessionID));
}
exports.execute = execute;