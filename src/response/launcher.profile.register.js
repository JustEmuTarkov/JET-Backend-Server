function execute(url, info, sessionID){
	let output = account_f.handler.register(info);
    return (output !== "") ? "FAILED" : "OK";
}
exports.execute = execute;