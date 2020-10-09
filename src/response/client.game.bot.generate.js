function execute(url, info, sessionID){
	return response_f.getBody(bots_f.generate(info, sessionID));
}
exports.execute = execute;