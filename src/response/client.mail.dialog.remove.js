function execute(url, info, sessionID){
	dialogue_f.dialogueServer.removeDialogue(info.dialogId, sessionID);
    return response_f.emptyArrayResponse();
}
exports.execute = execute;