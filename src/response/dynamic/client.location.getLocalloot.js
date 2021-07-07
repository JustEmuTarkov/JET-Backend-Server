exports.execute = (url, info, sessionID) => {
	let location_name = ""
	const params = new URL("https://127.0.0.1" + url).searchParams;
	if(typeof info.locationId != "undefined"){
		location_name = info.locationId;
	} else {
		location_name = params.get("locationId");
	}
		
	return response_f.getBody(location_f.handler.get(location_name));
}