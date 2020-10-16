function execute(url, info, sessionID){
	return response_f.getBody(location_f.locationServer.generateAll());
}
exports.execute = execute;