function execute(url, info, sessionID){
	let output = response_f.noBody(location_f.locationServer.get(url.replace("/api/location/", "")));
	return output;
}
exports.execute = execute;