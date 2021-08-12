

class Callbacks {
	cosntructor(){
	}
	getReceiveCallbacks()
	{
		return {
			"insurance": this.receiveInsurance,
			"SAVE": this.receiveSave
		};
	}
	getRespondCallbacks()
	{
		return {
			"BUNDLE": this.respondBundle,
			"IMAGE": this.respondImage,
			"NOTIFY": this.respondNotify,
			"DONE": this.respondKillResponse
		};
	}
	receiveInsurance(sessionID, req, resp, body, output)
	{
		if (req.url === "/client/notifier/channel/create") {
			insurance_f.handler.checkExpiredInsurance();
		}
	}
	receiveSave(sessionID, req, resp, body, output)
	{
		if (global._database.gameplayConfig.autosave.saveOnReceive) {
			savehandler_f.saveOpenSessions();
		}
	}
	
	respondBundle(sessionID, req, resp, body)
	{
		let bundleKey = req.url.split('/bundle/')[1];
		    bundleKey = decodeURI(bundleKey);
		logger.logInfo(`[BUNDLE]: ${req.url}`);
		let bundle = bundles_f.handler.getBundleByKey(bundleKey, true);
		let path = bundle.path;
		// send bundle
		server.tarkovSend.file(resp, path);
	}
	respondImage(sessionID, req, resp, body)
	{
		let splittedUrl = req.url.split('/');
		let fileName = splittedUrl[splittedUrl.length - 1].split('.').slice(0, -1).join('.');
		let baseNode = {};
		// get images to look through
		if (req.url.includes("/quest")) {
			logger.logInfo(`[IMG.quests]: ${req.url}`);
			baseNode = res.quest;
		} else if (req.url.includes("/handbook")) {
			logger.logInfo(`[IMG.handbook]: ${req.url}`);
			baseNode = res.handbook;
		} else if (req.url.includes("/avatar")) {
			logger.logInfo(`[IMG.trader]: ${req.url}`);
			baseNode = res.trader;
		} else if (req.url.includes("/banners")) {
			logger.logInfo(`[IMG.banners]: ${req.url}`);
			baseNode = res.banners;
		} else {
			logger.logInfo(`[IMG.hideout]: ${req.url}`);
			baseNode = res.hideout;
		}
		// send image
		server.tarkovSend.file(resp, baseNode[fileName]);
	}
	respondNotify(sessionID, req, resp, data)
	{
		let splittedUrl = req.url.split('/');
		sessionID = splittedUrl[splittedUrl.length - 1].split("?last_id")[0];
		notifier_f.handler.notificationWaitAsync(resp, sessionID);
	}
	respondKillResponse() 
	{
		return;
	}
}
exports.callbacks = new Callbacks();