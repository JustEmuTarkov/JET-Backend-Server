function execute(url, info, sessionID){
	return response_f.getBody(json.readParsed(db.cacheBase.matchMetrics));
}
exports.execute = execute;