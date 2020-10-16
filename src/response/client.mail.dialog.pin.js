function execute(url, info, sessionID){
	dialogue_f.dialogueServer.setDialoguePin(info.dialogId, true, sessionID);
    return response_f.emptyArrayResponse();
}
exports.execute = execute;