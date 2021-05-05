// This endpoint seems to be deprecated as of 12.10.

exports.execute = (url, info, sessionID) => {
	offraid_f.handler.addPlayer(sessionID, info);
}