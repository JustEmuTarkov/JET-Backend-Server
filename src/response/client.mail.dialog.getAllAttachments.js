function execute(url, info, sessionID){
	return response_f.getBody(dialogue_f.dialogueServer.getAllAttachments(info.dialogId, sessionID));
}
exports.execute = execute;