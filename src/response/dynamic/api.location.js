exports.execute = (url, info, sessionID) => {
	if(url.includes("factory4_day"))
		response_f.noBody(fileIO.readParsed(db.locations_test.factory4_day1).Location);
	
	response_f.noBody(location_f.handler.get(url.replace("/api/location/", "")))
};