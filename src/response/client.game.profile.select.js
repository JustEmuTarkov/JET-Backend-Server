function execute(url, info, sessionID){
	return response_f.getBody({"status":"ok", "notifier": {"server": server.getBackendUrl() + "/", "channel_id": "testChannel"}});
}
exports.execute = execute;