exports.execute = (url, info, sessionID) => {
	var obj = 
	{
		"queued": false, 
		"banTime": 0, 
		"hash": "BAN0", 
		"lang": "en", 
		"ndaFree": false,
		"reportAvailable": true,
		"languages": {},
		"aid": sessionID, 
		"token": sessionID, 
		"taxonomy": 6, 
		"activeProfileId": "pmc" + sessionID, 
		"nickname": "user", 
		"backend": {
			"Trading": server.getBackendUrl(), 
			"Messaging": server.getBackendUrl(), 
			"Main": server.getBackendUrl(), 
			"RagFair": server.getBackendUrl()
		}, 
		"totalInGame": 0,
		"utc_time": utility.getTimestamp()
	}
	let languages = locale_f.handler.getLanguages().data;
	for(let index in languages){
		var lang = languages[index];
		obj.languages[lang.ShortName] = lang.Name;
	}
	return response_f.getBody(obj);
}