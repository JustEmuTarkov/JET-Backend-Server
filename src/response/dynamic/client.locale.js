function execute(url, info, sessionID){
	return response_f.getUnclearedBody(locale_f.localeServer.getGlobal(url.replace("/client/locale/", '')))
}
exports.execute = execute;