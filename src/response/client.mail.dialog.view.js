function execute(url, info, sessionID){
	return dialogue_f.handler.generateDialogueView(info.dialogId, sessionID);
}
exports.execute = execute;