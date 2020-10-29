"use strict";

class Server {
    constructor() {
        this.buffers = {};
        this.name = serverConfig.name;
        this.ip = serverConfig.ip;
        this.port = serverConfig.port;
        this.backendUrl = "https://" + this.ip + ":" + this.port;
        this.version = "1.0.0";
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
		this.createStartCallback();
		this.createReceiveCallback();
		this.createRespondCallback();
		this.respondCallback["DONE"] = this.killResponse.bind(this);
    }
	
	createCacheCallback(){
        this.cacheCallback = {};
		let path = "./src/callbacks/cache";
		let files = json.readDir(path);
		for(let file of files){
			let scriptName = "cache" + file.replace(".js","");
			this.cacheCallback[scriptName] = require("../../src/callbacks/cache/" + file).cache;
		}
		logger.logSuccess("Create: Cache Callback");
	}

	createStartCallback(){
        this.startCallback = {};
		let path = "./src/callbacks/load";
		let files = json.readDir(path);
		for(let file of files){
			let scriptName = "load" + file.replace(".js","");
			this.startCallback[scriptName] = require("../../src/callbacks/load/" + file).load;
		}
		logger.logSuccess("Create: Start Callback");
	}
	
	createReceiveCallback(){
        this.receiveCallback = {};
		let path = "./src/callbacks/receive";
		let files = json.readDir(path);
		for(let file of files){
			let scriptName = file.replace(".js","");
			this.receiveCallback[scriptName] = require("../../src/callbacks/receive/" + file).execute;
		}
		logger.logSuccess("Create: Receive Callback");
	}
	
	createRespondCallback(){
        this.respondCallback = {};
		let path = "./src/callbacks/respond";
		let files = json.readDir(path);
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

        try {
            cert = json.read(certFile);
            key = json.read(keyFile);
        } catch (e) {
            if (e.code === 'ENOENT') {

                if (!json.exist(certDir)) {
                    json.mkDir(certDir);
                }

                let fingerprint;

                ({ cert, private: key, fingerprint } = internal.selfsigned.generate([{ name: 'commonName', value: this.ip + "/" }], { days: 365 }));

                logger.logInfo(`Generated self-signed x509 certificate ${fingerprint}, valid 365 days`);

                json.write(certFile, cert, true);
                json.write(keyFile, key, true);
            } else {
                throw e;
            }
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
        let fileStream = json.createReadStream(file);
    
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
		
		if(req.url.substr(0,6) != "/files" && req.url.substr(0,6) != "/notif" && req.url != "/client/game/keepalive" && req.url != "/player/health/sync")
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
		global._Database.globals = json.readParsed(db.cacheBase.globals);
		//allow to use file with {data:{}} as well as {}
		if(typeof global._Database.globals.data != "undefined")
			global._Database.globals = global._Database.globals.data;
	}
	// private function
	_loadGameplayConfig(){
		global._Database.gameplayConfig = json.readParsed(db.user.configs.gameplay);
	}
	// private function
	_loadDatabaseItems(){
		global._Database.items = json.readParsed(db.user.cache.items);
		if(typeof global._Database.items.data != "undefined")
			global._Database.items = global._Database.items.data;
		global._Database.templates = json.readParsed(db.user.cache.templates);
		if(typeof global._Database.templates.data != "undefined")
			global._Database.templates = global._Database.templates.data;
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
		this._loadGlobals();
		this._loadGameplayConfig();
		
        // execute start callback
        logger.logInfo("[Warmup]: Start callbacks...");
		//this.startCallback["loadStaticdata"](); // this need to run first cause reasons
        for (let type in this.startCallback) {
			if(type == "loadStaticdata") continue;
            this.startCallback[type]();
        }
		
		// Load Global Accesable Data Structures
		/*
			TODO: add more data here to not load them like retard each time aka assort etc. ~TheMaoci
			// 
			global.global._Database.items
			global.global._Database.globals
			global.global._Database.templates
			global.global._Database.gameplayConfig
			global.global._Database.assort[traderID]
			global.global._Database.someothershit
		*/
		this._loadDatabaseItems();
		logger.logInfo("Starting server...");
		this._serverStart();
    }
}

module.exports.server = new Server();