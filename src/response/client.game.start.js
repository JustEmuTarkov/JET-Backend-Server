exports.execute = (url, info, sessionID) => {
	let accounts = json.readParsed(db.user.configs.accounts);
	for(let account in accounts){
		if(account == sessionID)
		{
			if(!json.exist("user/profiles/" + sessionID + "/character.json"))
				logger.logWarning("New account login!");
			return response_f.getBody(null, 0, null);
		}
	}
	return response_f.getBody(null, 999, "Profile Not Found!!");
}