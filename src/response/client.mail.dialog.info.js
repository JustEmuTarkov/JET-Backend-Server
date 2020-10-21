function execute(url, info, sessionID){
	return response_f.getBody(dialogue_f.handler.getDialogueInfo(info.dialogId, sessionID));
}
exports.execute = execute;