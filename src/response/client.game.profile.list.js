counter = 1;

exports.execute = (url, info, sessionID) => {
	if(counter == 1){
		counter++;
		return response_f.getBody([])
	} else {
		counter = 1;
		return response_f.getBody(profile_f.handler.getCompleteProfile(sessionID));
	}
	//response_f.getBody(profile_f.handler.getCompleteProfile(sessionID))
	
};
