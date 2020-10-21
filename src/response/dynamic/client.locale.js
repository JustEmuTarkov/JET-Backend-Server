function execute(url, info, sessionID){
	return response_f.getUnclearedBody(locale_f.handler.getGlobal(url.replace("/client/locale/", '')))
}
exports.execute = execute;