function execute(url, info, sessionID){
	console.log(info);
	console.log(sessionID);
	offraid_f.handler.addPlayer(sessionID, info);
}
exports.execute = execute;