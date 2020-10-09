function execute(url, info, sessionID){
	profile_f.profileServer.changeVoice(info, sessionID);
    return response_f.nullResponse();
}
exports.execute = execute;