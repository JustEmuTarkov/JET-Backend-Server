exports.execute = (url, info, sessionID) => {
	global._Database.globals.time = Date.now() / 1000;
    return response_f.getBody(global._Database.globals);
}