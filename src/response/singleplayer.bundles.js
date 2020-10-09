function execute(url, info, sessionID){
	let local = serverConfig.ip === "127.0.0.1";
    return response_f.noBody(bundles_f.bundlesServer.getBundles(local));
}
exports.execute = execute;