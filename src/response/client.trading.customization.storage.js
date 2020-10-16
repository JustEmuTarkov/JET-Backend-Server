function execute(url, info, sessionID){
	return json.read(customization_f.getPath(sessionID));
}
exports.execute = execute;