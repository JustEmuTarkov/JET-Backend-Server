function execute(url, info, sessionID){
	return response_f.getBody(
		{
			"notifier": {
				"server": `${server.getBackendUrl()}/`, 
				"channel_id": "testChannel", 
				"url": `${server.getBackendUrl()}/notifierServer/get/${sessionID}`
			}, 
			"notifierServer": `${server.getBackendUrl()}/notifierServer/get/${sessionID}`
		}
	);
}
exports.execute = execute;