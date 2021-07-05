exports.execute = (url, info, sessionID) => {
	if(typeof sessionID == "undefined")
		return response_f.getBody({"msg": "No Session", "utc_time": utility.getTimestamp()});
	keepalive_f.main(sessionID);
    return response_f.getBody({"msg": "OK", "utc_time": utility.getTimestamp()});
}