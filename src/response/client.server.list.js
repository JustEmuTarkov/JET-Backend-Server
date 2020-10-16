function execute(url, info, sessionID){
	return response_f.getBody(
		[
			{
				"ip": server.getIp(), 
				"port": server.getPort()
			}
		]
	);
}
exports.execute = execute;