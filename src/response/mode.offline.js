exports.execute = (url, info, sessionID) => {
	return response_f.noBody(
		{
			"Offline": serverConfig.offline
		}
	);
}