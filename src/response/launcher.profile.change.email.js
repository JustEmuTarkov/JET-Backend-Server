function execute(url, info, sessionID){
	let output = account_f.accountServer.changeEmail(info);
    return (output === "") ? "FAILED" : "OK";
}
exports.execute = execute;