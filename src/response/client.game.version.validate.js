exports.execute = (url, info, sessionID) => { 
	logger.logInfo("User connected from client version:" + info.version.major);
	return response_f.nullResponse(); 
}