function execute(url, info, sessionID){
	dialogue_f.dialogueServer.setRead(info.dialogs, sessionID);
    return response_f.emptyArrayResponse();
}
exports.execute = execute;