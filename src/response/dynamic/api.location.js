function execute(url, info, sessionID){
	console.log(url);
	console.log(url.replace("/api/location/", ""));
	let output = response_f.noBody(location_f.locationServer.get(url.replace("/api/location/", "")));
	return output;
}
exports.execute = execute;