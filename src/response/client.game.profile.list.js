exports.execute = (url, info, sessionID) => {
	return response_f.getBody(profile_f.handler.getCompleteProfile(sessionID));
};
