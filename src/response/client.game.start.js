exports.execute = (url, info, sessionID) => {
	if(json.exist("user/profiles/" + sessionID + "/character.json"))
		return response_f.getBody(null, 0, null);
		
	return response_f.getBody(null, 999, "Profile Not Found!!");
}