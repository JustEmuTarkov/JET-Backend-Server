function execute(url, info, sessionID){
	return response_f.getBody(weather_f.generate());
}
exports.execute = execute;