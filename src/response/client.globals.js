function execute(url, info, sessionID){
	global._Database.globals.time = Date.now() / 1000;
    return json.stringify(globals);
}
exports.execute = execute;