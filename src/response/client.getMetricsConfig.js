function execute(url, info, sessionID){
	return response_f.getBody(json.parse(json.read(db.cacheBase.matchMetrics)));
}
exports.execute = execute;