function execute(url, info, sessionID){
	return json.stringify({
        "backendUrl": server.getBackendUrl(),
        "name": server.getName(),
        "editions": Object.keys(db.profile)
    });
}
exports.execute = execute;