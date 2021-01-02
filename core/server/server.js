"use strict";

class Server {
    constructor() {
        this.buffers = {};
        this.name = serverConfig.name;
        this.ip = serverConfig.ip;
        this.port = serverConfig.port;
        this.backendUrl = "https://" + this.ip + ":" + this.port;
		this.second_backendUrl = "https://" + serverConfig.ip_backend + ":" + this.port;
        
        this.version = "1.0.3";
        this.mime = {
            html: 'text/html',
            txt: 'text/plain',
            jpg: 'image/jpeg',
            png: 'image/png',
            css: 'text/css',
            otf: 'font/opentype',
            json: 'application/json'
        };
		this.createCacheCallback();
		//this.createStartCallback();
		this.createReceiveCallback();
		this.createRespondCallback();
		this.respondCallback["DONE"] = this.killResponse.bind(this);
    }
	
	createCacheCallback(){
        this.cacheCallback = {};
		let path = "./src/callbacks/cache";
		let files = fileIO.readDir(path);
		for(let file of files){
			let scriptName = "cache" + file.replace(".js","");
			this.cacheCallback[scriptName] = require("../../src/callbacks/cache/" + file).cache;
		}
		logger.logSuccess("Create: Cache Callback");
	}
	/*createStartCallback(){
        this.startCallback = {};
		let path = "./src/callbacks/load";
		let files = fileIO.readDir(path);
		for(let file of files){
			let scriptName = "load" + file.replace(".js","");
			this.startCallback[scriptName] = require("../../src/callbacks/load/" + file).load;
		}
		logger.logSuccess("Create: Start Callback");
	}*/
	createReceiveCallback(){
        this.receiveCallback = {};
		let path = "./src/callbacks/receive";
		let files = fileIO.readDir(path);
		for(let file of files){
			let scriptName = file.replace(".js","");
			this.receiveCallback[scriptName] = require("../../src/callbacks/receive/" + file).execute;
		}
		logger.logSuccess("Create: Receive Callback");
	}
	createRespondCallback(){
        this.respondCallback = {};
		let path = "./src/callbacks/respond";
		let files = fileIO.readDir(path);
		for(let file of files){
			let scriptName = file.replace(".js","");
			this.respondCallback[scriptName] = require("../../src/callbacks/respond/" + file).execute;
		}
		logger.logSuccess("Create: Respond Callback");
	}

    resetBuffer(sessionID) {
        this.buffers[sessionID] = undefined;
    }
    putInBuffer(sessionID, data, bufLength) {
        if (this.buffers[sessionID] === undefined || this.buffers[sessionID].allocated !== bufLength) {
            this.buffers[sessionID] = {
                written: 0,
                allocated: bufLength,
                buffer: Buffer.alloc(bufLength)
            };
        }
    
        let buf = this.buffers[sessionID];
        
        data.copy(buf.buffer, buf.written, 0);
        buf.written += data.length;
        return buf.written === buf.allocated;
    }
    
    getFromBuffer(sessionID) {
        return this.buffers[sessionID].buffer;
    }
    getName() {
        return this.name;
    }
    getIp() {
        return this.ip;
    }
    getPort() {
        return this.port;
    }
    getBackendUrl() {
		if(this.second_backendUrl != null)
			return this.second_backendUrl;
        return this.backendUrl;
    }
    getVersion() {
        return this.version;
    }
    generateCertificate() {

        const certDir = internal.resolve(__dirname, '../../user/certs');

        const certFile = internal.resolve(certDir, 'cert.pem');
        const keyFile = internal.resolve(certDir, 'key.pem');

        let cert,
            key;

        
		if(fileIO.exist(certFile) && fileIO.exist(keyFile)){
			cert = fileIO.readParsed(certFile);
			key = fileIO.readParsed(keyFile);
		} else {
			if (!fileIO.exist(certDir)) {
				fileIO.mkDir(certDir);
			}

			let fingerprint;

			({ cert, private: key, fingerprint } = internal.selfsigned.generate(null, 
			{
			  keySize: 2048, // the size for the private key in bits (default: 1024)
			  days: 365, // how long till expiry of the signed certificate (default: 365)
			  algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
			  extensions: [{ name: 'commonName', cA: true , value: this.ip + "/"}], // certificate extensions array
			  pkcs7: true, // include PKCS#7 as part of the output (default: false)
			  clientCertificate: true, // generate client cert signed by the original key (default: false)
			  clientCertificateCN: 'jdoe' // client certificate's common name (default: 'John Doe jdoe123')
			}));

			logger.logInfo(`Generated self-signed sha256/2048 certificate ${fingerprint}, valid 365 days`);

			fileIO.write(certFile, cert, true);
			fileIO.write(keyFile, key, true);
		}

        return { cert, key };
    }

    sendZlibJson(resp, output, sessionID) {
        resp.writeHead(200, "OK", {'Content-Type': this.mime['json'], 'content-encoding' : 'deflate', 'Set-Cookie' : 'PHPSESSID=' + sessionID});
    
        internal.zlib.deflate(output, function (err, buf) {
            resp.end(buf);
        });
    }
    sendTextJson(resp, output) {
        resp.writeHead(200, "OK", {'Content-Type': this.mime['json']});
        resp.end(output);
    }
	sendHtml(resp, output) {
        resp.writeHead(200, "OK", {'Content-Type': this.mime['html']});
        resp.end(output);
    }
    sendFile(resp, file) {
        let pathSlic = file.split("/");
        let type = this.mime[pathSlic[pathSlic.length -1].split(".")[1]] || this.mime['txt'];
        let fileStream = fileIO.createReadStream(file);
    
        fileStream.on('open', function () {
            resp.setHeader('Content-Type', type);
            fileStream.pipe(resp);
        });
    }

    killResponse() {
        return;
    }

    sendResponse(sessionID, req, resp, body) {
        let output = "";
		if(req.url == "/favicon.ico"){
			this.sendFile(resp, "res/icon.ico");
			return;
		}
		if(req.url.includes(".css")){
			this.sendFile(resp, "res/style.css");
			return;
		}
		if(req.url.includes("bender.light.otf")){
			this.sendFile(resp, "res/bender.light.otf");
			return;
		}
		
		if(req.url.includes("/server/config")){
			// load html page represented by home_f
			output = router.getResponse(req, body, sessionID);
			this.sendHtml(resp, output, "");
		}
		if(req.url == "/")
		{
			//home_f.processSaveData(body);
			// its hard to create a file `.js` in folder in windows cause it looks cancerous so we gonna write this code here 
			output = home_f.RenderHomePage();
			this.sendHtml(resp, output, "");
			return;
		}
	
        // get response
        if (req.method === "POST" || req.method === "PUT") {
            output = router.getResponse(req, body, sessionID);
        } else {
            output = router.getResponse(req, "", sessionID);
        }

        /* route doesn't exist or response is not properly set up */
        if (output === "") {
            logger.logError(`[UNHANDLED][${req.url}]`);
            logger.logData(body);
            output = `{"err": 404, "errmsg": "UNHANDLED RESPONSE: ${req.url}", "data": null}`;
        }
        // execute data received callback
        for (let type in this.receiveCallback) {
            this.receiveCallback[type](sessionID, req, resp, body, output);
        }

        // send response
        if (output in this.respondCallback) {
            this.respondCallback[output](sessionID, req, resp, body);
        } else {
            this.sendZlibJson(resp, output, sessionID);
        }
    }
    handleRequest(req, resp) {
        let IP = req.connection.remoteAddress.replace("::ffff:", "");
		    IP = ((IP == "127.0.0.1")?"LOCAL":IP);
        const sessionID = utility.getCookies(req)['PHPSESSID'];
		let displaySessID = ((typeof sessionID != "undefined")?`[${sessionID}]`:"");
		
		if(req.url.substr(0,6) != "/files" && req.url.substr(0,6) != "/notif" && req.url != "/client/game/keepalive" && req.url != "/player/health/sync" && !req.url.includes(".css") && !req.url.includes(".otf") && !req.url.includes(".ico"))
			logger.logRequest(req.url, `${displaySessID}[${IP}] `);
    
        // request without data
        if (req.method === "GET") {
            server.sendResponse(sessionID, req, resp, "");
        }
    
        // request with data
        if (req.method === "POST") {
            req.on('data', function (data) {
				if(req.url == "/" || req.url.includes("/server/config")){
					let _Data = data.toString();
					_Data = _Data.split('&');
					let _newData = {};
					for(let item in _Data){
						let datas = _Data[item].split('=');
						_newData[datas[0]] = datas[1];
					}
                    server.sendResponse(sessionID, req, resp, _newData);
					return;
				}
                internal.zlib.inflate(data, function (err, body) {

                    let jsonData = ((body !== typeof "undefined" && body !== null && body !== "") ? body.toString() : '{}');
                    server.sendResponse(sessionID, req, resp, jsonData);
                });
            });
        }
    
        // emulib responses
        if (req.method === "PUT") {
            req.on('data', function(data) {
                // receive data
                if ("expect" in req.headers) {
                    const requestLength = parseInt(req.headers["content-length"]);
    
                    if (!server.putInBuffer(req.headers.sessionid, data, requestLength)) {
                        resp.writeContinue();
                    }
                }
            }).on('end', function() {
                let data = server.getFromBuffer(sessionID);
                server.resetBuffer(sessionID);

                internal.zlib.inflate(data, function (err, body) {
                    let jsonData = ((body !== typeof "undefined" && body !== null && body !== "") ? body.toString() : '{}');
                    server.sendResponse(sessionID, req, resp, jsonData);
                });
            });
        }
    }
	
	// private function
	_loadGlobals(){
		global._database.globals = fileIO.readParsed(db.cacheBase.globals);
		//allow to use file with {data:{}} as well as {}
		if(typeof global._database.globals.data != "undefined")
			global._database.globals = global._database.globals.data;
	}
	// private function
	_loadGameplayConfig(){
		global._database.gameplayConfig = fileIO.readParsed(db.user.configs.gameplay);
	}
	_loadBotsData(){
		global._database.bots = {};
		for(let botType in db.bots){
			global._database.bots[botType] = {};
			let difficulty_easy = null;
			let difficulty_normal =  null;
			let difficulty_hard = null;
			let difficulty_impossible = null;
			if(typeof db.bots[botType].difficulty != "undefined"){
				if(typeof db.bots[botType].difficulty.easy != "undefined")
					difficulty_easy = fileIO.readParsed(db.bots[botType].difficulty.easy);
				if(typeof db.bots[botType].difficulty.normal != "undefined")
					difficulty_normal = fileIO.readParsed(db.bots[botType].difficulty.normal);
				if(typeof db.bots[botType].difficulty.hard != "undefined")
					difficulty_hard = fileIO.readParsed(db.bots[botType].difficulty.hard);
				if(typeof db.bots[botType].difficulty.impossible != "undefined")
					difficulty_impossible = fileIO.readParsed(db.bots[botType].difficulty.impossible);
			}
			global._database.bots[botType].difficulty = {
				"easy": difficulty_easy,
				"normal": difficulty_normal,
				"hard": difficulty_hard,
				"impossible": difficulty_impossible,
			};
			global._database.bots[botType].appearance = fileIO.readParsed(db.bots[botType].appearance);
			global._database.bots[botType].chances = fileIO.readParsed(db.bots[botType].chances);
			global._database.bots[botType].experience = fileIO.readParsed(db.bots[botType].experience);
			global._database.bots[botType].generation = fileIO.readParsed(db.bots[botType].generation);
			global._database.bots[botType].health = fileIO.readParsed(db.bots[botType].health);
			global._database.bots[botType].inventory = fileIO.readParsed(db.bots[botType].inventory);
			global._database.bots[botType].names = fileIO.readParsed(db.bots[botType].names);
		}
	}
	_loadCoreData(){
		global._database.core = {};
		global._database.core.botBase = fileIO.readParsed(db.cacheBase.botBase);
		global._database.core.botCore = fileIO.readParsed(db.cacheBase.botCore);
		global._database.core.fleaOffer = fileIO.readParsed(db.cacheBase.fleaOffer);
		global._database.core.matchMetrics = fileIO.readParsed(db.cacheBase.matchMetrics);
	}
	// private function
	_loadDatabaseItems(){
		global._database.items = fileIO.readParsed(db.user.cache.items);
		if(typeof global._database.items.data != "undefined")
			global._database.items = global._database.items.data;
		global._database.templates = fileIO.readParsed(db.user.cache.templates);
		if(typeof global._database.templates.data != "undefined")
			global._database.templates = global._database.templates.data;
	}
	
	_serverStart(){
		let backend = this.backendUrl;
        /* create server */
        let httpsServer = internal.https.createServer(this.generateCertificate(), (req, res) => {
            this.handleRequest(req, res);
        }).listen(this.port, this.ip, function() {
            logger.logSuccess(`Server is working at: ${backend}`);
        });

        /* server is already running or program using privileged port without root */
        httpsServer.on('error', function(e) {
            if (internal.process.platform === "linux" && !(internal.process.getuid && internal.process.getuid() === 0) && e.port < 1024) {
				logger.throwErr("» Non-root processes cannot bind to ports below 1024.", ">> core/server.server.js line 274");
            } else if (e.code == "EADDRINUSE") {
				internal.psList().then(data => {
					let cntProc = 0;
					for(let proc of data){
						let procName = proc.name.toLowerCase();
						if((procName.indexOf("node") != -1 || 
						procName.indexOf("server") != -1 ||
						procName.indexOf("emu") != -1 ||
						procName.indexOf("justemu") != -1) && proc.pid != internal.process.pid){
							logger.logWarning(`ProcessID: ${proc.pid} - Name: ${proc.name}`);
							cntProc++;
						}
					}
					if(cntProc > 0)
						logger.logError("Please close this process'es before starting this server.");
				});
                logger.throwErr(`» Port ${e.port} is already in use`, "");
            } else {
				throw e;
			};
        });
	}

    start() {
        // execute cache callback
        logger.logInfo("[Warmup]: Cache callbacks...");
        for (let type in this.cacheCallback) {
            this.cacheCallback[type]();
        }
		if(serverConfig.rebuildCache)
			global.core.route.CacheModLoad(); // CacheModLoad
		global.core.route.ResModLoad(); // load Res Mods
        logger.logInfo("[Warmup]: Loading Database: CoreData...");
		this._loadCoreData();
        logger.logInfo("[Warmup]: Loading Database: Globals...");
		this._loadGlobals();
        logger.logInfo("[Warmup]: Loading Database: GameplayConfig...");
		this._loadGameplayConfig();
        logger.logInfo("[Warmup]: Loading Database: BotsData...");
		this._loadBotsData();
		
        // execute start callback
        logger.logInfo("[Warmup]: Start callbacks...");
		//this.startCallback["loadStaticdata"](); // this need to run first cause reasons
        for (let type in global) {
			if(type.indexOf("_f") != type.length-2) continue;
			if(typeof global[type].handler == "object"){
				if(typeof global[type].handler.initialize == "function"){
					global[type].handler.initialize();
				}
			}
			if(typeof global[type].initialize == "function"){
					global[type].initialize();
			}
        }
		
		// Load Global Accesable Data Structures
		/*
			TODO: add more data here to not load them like retard each time aka assort etc. ~TheMaoci
			// 
			global.global._database.items
			global.global._database.globals
			global.global._database.templates
			global.global._database.gameplayConfig
			global.global._database.assort[traderID]
			global.global._database.someothershit
		*/
		this._loadDatabaseItems();
		global.core.route.TamperModLoad(); // TamperModLoad

		/*console.log("staticRoutes")
		console.log(router.staticRoutes)
		console.log("dynamicRoutes")
		console.log(router.dynamicRoutes)
		return;*/
		
		logger.logInfo("Starting server...");
		this._serverStart();
    }
}

module.exports.server = new Server();