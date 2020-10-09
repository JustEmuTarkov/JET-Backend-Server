function execute(url, info, sessionID){
	return response_f.getBody({"isvalid": true, "latestVersion": ""});
}
exports.execute = execute;