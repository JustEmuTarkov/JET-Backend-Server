exports.execute = (url, info, sessionID) => {
	const splittedUrl = url.split("/");
	const type = splittedUrl[splittedUrl.length - 1];
	return response_f.getBody(bots_f.getBotLimit(type));	
}