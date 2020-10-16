function execute(url, info, sessionID){
	return dialogue_f.dialogueServer.generateDialogueView(info.dialogId, sessionID);
}
exports.execute = execute;