exports.execute = (url, body, sessionID) => {
	home_f.processSaveData(body, db.user.configs.server);
	return home_f.RenderServerConfigPage("/server/config/server");
}