exports.execute = (url, info, sessionID) => {
	sessionID = "AID8131647517931710690RF";
	return response_f.getBody(trader_f.handler.getAllTraders(sessionID));
}