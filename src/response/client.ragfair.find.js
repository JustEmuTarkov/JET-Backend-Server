function execute(url, info, sessionID){
	return json.stringify({"err": 0, "errmsg": null, "data": ragfair_f.getOffers(sessionID, info)});
}
exports.execute = execute;