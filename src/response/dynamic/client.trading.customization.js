function execute(url, info, sessionID){
	let splittedUrl = url.split('/');
    let traderID = splittedUrl[splittedUrl.length - 2];
    return response_f.getBody(trader_f.traderServer.getCustomization(traderID, sessionID));
}
exports.execute = execute;