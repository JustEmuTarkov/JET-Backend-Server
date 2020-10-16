function execute(url, info, sessionID){
	console.log(info);
	console.log(sessionID);
	offraid_f.inraidServer.addPlayer(sessionID, info);
}
exports.execute = execute;