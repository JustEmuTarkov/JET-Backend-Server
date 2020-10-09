function execute(url, info, sessionID){
	return response_f.getBody(insurance_f.cost(info, sessionID));
}
exports.execute = execute;