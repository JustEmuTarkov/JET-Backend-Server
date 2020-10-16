function execute(url, info, sessionID){
	let output = account_f.accountServer.changePassword(info);
    return (output === "") ? "FAILED" : "OK";
}
exports.execute = execute;