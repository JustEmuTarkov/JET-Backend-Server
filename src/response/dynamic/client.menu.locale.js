function execute(url, info, sessionID){
	return response_f.getBody(locale_f.handler.getMenu(url.replace("/client/menu/locale/", '')));
}
exports.execute = execute;