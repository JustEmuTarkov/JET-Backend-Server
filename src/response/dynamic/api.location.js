function execute(url, info, sessionID){
	return location_f.locationServer.get(url.replace("/api/location/", ""));
}
exports.execute = execute;