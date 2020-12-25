exports.execute = (url, info, sessionID) => {
	global._database.items = require("../../" + db.user.cache.items);
	if(typeof global._database.items.data != "undefined")
		global._database.items = global._database.items.data;
	return response_f.getBody(global._database.items);
}