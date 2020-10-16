function execute(url, info, sessionID){
	let output = account_f.accountServer.wipe(info);
    return (output === "") ? "FAILED" : "OK";
}
exports.execute = execute;