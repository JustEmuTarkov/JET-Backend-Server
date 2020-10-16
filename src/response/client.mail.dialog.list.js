function execute(url, info, sessionID){
	return dialogue_f.dialogueServer.generateDialogueList(sessionID);
}
exports.execute = execute;