exports.execute = (url, info, sessionID) => {
	return response_f.getBody(
		{
			"queued": false, 
			"banTime": 0, 
			"hash": "BAN0", 
			"lang": "en", 
			"languages": {
				"en": "English",
				"fr": "French",
				"ge": "German",
				"ru": "Русский"
			},
			"ndaFree": false,
			"reportAvailable": true,
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
	);
}