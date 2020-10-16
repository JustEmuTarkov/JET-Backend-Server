function execute(url, info, sessionID){
	globals.data.time = Date.now() / 1000;
    return json.stringify(globals);
}
exports.execute = execute;