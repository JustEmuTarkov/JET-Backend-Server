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

        const certDir = resolve(__dirname, '../../user/certs');

        const certFile = resolve(certDir, 'cert.pem');
        const keyFile = resolve(certDir, 'key.pem');

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

                ({ cert, private: key, fingerprint } = selfsigned.generate([{ name: 'commonName', value: this.ip + "/" }], { days: 365 }));

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
    
        zlib.deflate(output, function (err, buf) {
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
    
		if(req.url == "/")
		{
			output = "<body><style>h2{font-size:20px;padding:3px 5px;} h3{font-size:18px;padding:3px 15px;} p{font-size:14px;padding:3px 25px} body{color:#fff;background:#000}</style>";
			let data = json.readParsed(db.user.configs.gameplay);
			for(let category in data){
				output += "<h2>" + category + "</h2>";
				for (let sub in data[category])
				{
					if(typeof data[category][sub] == "object"){
						output += "<h3>" + sub + "</h3>";
						for(let subSub in data[category][sub])
						{
							output += "<p>- " + subSub + ": " + data[category][sub][subSub] + "</p>";
						}
					} else {
						output += "<p>- " + sub + ": " + data[category][sub] + "</p>";
					}
				}
			}
			
			output += "</body>";
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
		
		if(req.url.substr(0,6) != "/files" && req.url.substr(0,6) != "/notif" && req.url != "/client/game/keepalive")
			logger.logRequest(req.url, `${displaySessID}[${IP}] `);
    
        // request without data
        if (req.method === "GET") {
            server.sendResponse(sessionID, req, resp, "");
        }
    
        // request with data
        if (req.method === "POST") {
            req.on('data', function (data) {
                zlib.inflate(data, function (err, body) {
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

                zlib.inflate(data, function (err, body) {
                    let jsonData = ((body !== typeof "undefined" && body !== null && body !== "") ? body.toString() : '{}');
                    server.sendResponse(sessionID, req, resp, jsonData);
                });
            });
        }
    }

    start() {
        // execute cache callback
        logger.logInfo("[Warmup]: Cache callbacks...");
        for (let type in this.cacheCallback) {
            this.cacheCallback[type]();
        }

        // execute start callback
        logger.logInfo("[Warmup]: Start callbacks...");
		this.startCallback["loadStaticdata"](); // this need to run first cause reasons
        for (let type in this.startCallback) {
			if(type == "loadStaticdata") continue;
            this.startCallback[type]();
        }
		
		logger.logInfo("Starting server...");
		let backend = this.backendUrl;
        /* create server */
        let httpsServer = https.createServer(this.generateCertificate(), (req, res) => {
            this.handleRequest(req, res);
        }).listen(this.port, this.ip, function() {
            logger.logSuccess(`Server is working at: ${backend}`);
        });

        /* server is already running or program using privileged port without root */
        httpsServer.on('error', function(e) {
            if (process.platform === "linux" && !(process.getuid && process.getuid() === 0) && e.port < 1024) {
				logger.throwErr("» Non-root processes cannot bind to ports below 1024.", ">> core/server.server.js line 274");
            } else if (e.code == "EADDRINUSE") {
				psList().then(data => {
					let cntProc = 0;
					for(let proc of data){
						let procName = proc.name.toLowerCase();
						if((procName.indexOf("node") != -1 || 
						procName.indexOf("server") != -1 ||
						procName.indexOf("emu") != -1 ||
						procName.indexOf("justemu") != -1) && proc.pid != process.pid){
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
}

module.exports.server = new Server();