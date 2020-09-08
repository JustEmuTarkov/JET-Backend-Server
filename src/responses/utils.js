"use strict";
var Zip = require('node-7z-forall');

async function unpackDBFiles(url, info, sessionID) {
	logger.logInfo("Manual Call: Unpacking Database files... (do not use server at the moment!)");
	let response = await utils_f.baseUtils.unZip("db_RemovableData.7z", "db");
	return response_f.getBody({"response": response});
}

router.addStaticRoute("/unzip", unpackDBFiles);
