"use strict";





class Server {
  constructor() {
    this.tarkovSend = require("./tarkovSend.js").struct;
    this.name = serverConfig.name;
    this.ip = serverConfig.ip;
    this.port = serverConfig.port;
    this.backendUrl = "https://" + this.ip + ":" + this.port;
    this.second_backendUrl = "https://" + serverConfig.ip_backend + ":" + this.port;

    this.initializeCallbacks();
  }


  initializeCallbacks() {
    const callbacks = require(executedDir + "/src/functions/callbacks.js").callbacks;

    this.receiveCallback = callbacks.getReceiveCallbacks();
    this.respondCallback = callbacks.getRespondCallbacks();

    logger.logSuccess("Create: Receive Callback");
  }

  resetBuffer(sessionID) {
    this.buffers[sessionID] = undefined;
  }
  putInBuffer(sessionID, data, bufLength) {
    if (this.buffers[sessionID] === undefined || this.buffers[sessionID].allocated !== bufLength) {
      this.buffers[sessionID] = {
        written: 0,
        allocated: bufLength,
        buffer: Buffer.alloc(bufLength),
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
    return this.second_backendUrl != null ? this.second_backendUrl : this.backendUrl;
  }
  getVersion() {
    return globals.core.constants.ServerVersion;
  }

  sendResponse(sessionID, req, resp, body) {
    let output = "";
    if (req.url == "/favicon.ico") {
      this.tarkovSend.file(resp, "res/icon.ico");
      return;
    }
    if (req.url.includes(".css")) {
      this.tarkovSend.file(resp, "res/style.css");
      return;
    }
    if (req.url.includes("bender.light.otf")) {
      this.tarkovSend.file(resp, "res/bender.light.otf");
      return;
    }

    if (req.url.includes("/server/config")) {
      // load html page represented by home_f
      output = router.getResponse(req, body, sessionID);
      this.tarkovSend.html(resp, output, "");
    }
    if (req.url == "/") {
      //home_f.processSaveData(body);
      // its hard to create a file `.js` in folder in windows cause it looks cancerous so we gonna write this code here
      output = home_f.RenderHomePage();
      this.tarkovSend.html(resp, output, "");
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
    } else {
      logger.logDebug(body, true);
    }
    // execute data received callback
    for (let type in this.receiveCallback) {
      this.receiveCallback[type](sessionID, req, resp, body, output);
    }

    // send response
    if (output in this.respondCallback) {
      this.respondCallback[output](sessionID, req, resp, body);
    } else {
      this.tarkovSend.zlibJson(resp, output, sessionID);
    }
  }

  async handleRequest(req, resp) {
    let IP = req.connection.remoteAddress.replace("::ffff:", "");
    IP = IP == "127.0.0.1" ? "LOCAL" : IP;

    let sessionID_test = utility.getCookies(req)["PHPSESSID"];
    if (consoleResponse.getDebugEnabled()) {
      sessionID_test = consoleResponse.getSession();
    }
    const sessionID = sessionID_test;

    let displaySessID = typeof sessionID != "undefined" ? `[${sessionID}]` : "";

    if (
      req.url.substr(0, 6) != "/files" &&
      req.url.substr(0, 6) != "/notif" &&
      req.url != "/client/game/keepalive" &&
      req.url != "/player/health/sync" &&
      !req.url.includes(".css") &&
      !req.url.includes(".otf") &&
      !req.url.includes(".ico") &&
      !req.url.includes("singleplayer/settings/bot/difficulty")
    )
      logger.logRequest(req.url, `${displaySessID}[${IP}] `);

    // request without data
    if (req.method === "GET") {
      server.sendResponse(sessionID, req, resp, "");
    }

    // request with data
    if (req.method === "POST") {
      req.on("data", function (data) {
        if (req.url == "/" || req.url.includes("/server/config")) {
          let _Data = data.toString();
          _Data = _Data.split("&");
          let _newData = {};
          for (let item in _Data) {
            let datas = _Data[item].split("=");
            _newData[datas[0]] = datas[1];
          }
          server.sendResponse(sessionID, req, resp, _newData);
          return;
        }
        internal.zlib.inflate(data, function (err, body) {
          let jsonData = body !== typeof "undefined" && body !== null && body !== "" ? body.toString() : "{}";
          server.sendResponse(sessionID, req, resp, jsonData);
        });
      });
    }

    // emulib responses
    if (req.method === "PUT") {
      req
        .on("data", function (data) {
          // receive data
          if ("expect" in req.headers) {
            const requestLength = parseInt(req.headers["content-length"]);

            if (!server.putInBuffer(req.headers.sessionid, data, requestLength)) {
              resp.writeContinue();
            }
          }
        })
        .on("end", function () {
          let data = server.getFromBuffer(sessionID);
          server.resetBuffer(sessionID);

          internal.zlib.inflate(data, function (err, body) {
            let jsonData = body !== typeof "undefined" && body !== null && body !== "" ? body.toString() : "{}";
            server.sendResponse(sessionID, req, resp, jsonData);
          });
        });
    }
  }

  _serverStart() {
    let backend = this.backendUrl;
    /* create server */
    const certificate = require("./certGenerator.js").certificate;

    let httpsServer = internal.https
      .createServer(certificate.generate(), (req, res) => {
        this.handleRequest(req, res);
      })
      .listen(this.port, this.ip, function () {
        logger.logSuccess(`Server is working at: ${backend}`);
      });

    /* server is already running or program using privileged port without root */
    httpsServer.on("error", function (e) {
      if (internal.process.platform === "linux" && !(internal.process.getuid && internal.process.getuid() === 0) && e.port < 1024) {
        logger.throwErr("» Non-root processes cannot bind to ports below 1024.", ">> core/server.server.js line 274");
      } else if (e.code == "EADDRINUSE") {
        internal.psList().then((data) => {
          let cntProc = 0;
          for (let proc of data) {
            let procName = proc.name.toLowerCase();
            if (
              (procName.indexOf("node") != -1 || procName.indexOf("server") != -1 || procName.indexOf("emu") != -1 || procName.indexOf("justemu") != -1) &&
              proc.pid != internal.process.pid
            ) {
              logger.logWarning(`ProcessID: ${proc.pid} - Name: ${proc.name}`);
              cntProc++;
            }
          }
          if (cntProc > 0) logger.logError("Please close this process'es before starting this server.");
        });
        logger.throwErr(`» Port ${e.port} is already in use`, "");
      } else {
        throw e;
      }
    });
  }

  softRestart() {
    logger.logInfo("[SoftRestart]: Reloading Database");
    global.mods_f.ResModLoad();
    const databasePath = "/src/functions/database.js";
    require(executedDir + databasePath).load();
    // will not be required if all data is loaded into memory
    logger.logInfo("[SoftRestart]: Re-initializing");
    account_f.handler.initialize();
    savehandler_f.initialize();
    locale_f.handler.initialize();
    preset_f.handler.initialize();
    weather_f.handler.initialize();
    logger.logInfo("[SoftRestart]: Reloading TamperMods");
    global.mods_f.TamperModLoad(); // TamperModLoad
    bundles_f.handler.initialize();
  }

  start() {
    // execute cache callback
    if (serverConfig.rebuildCache) {
      logger.logInfo("[Warmup]: Cache callbacks...");
      for (let type in this.cacheCallback) {
        this.cacheCallback[type]();
      }
      global.mods_f.CacheModLoad(); // CacheModLoad
    }
    global.mods_f.ResModLoad(); // load Res Mods

    logger.logInfo("[Warmup]: Loading Database");
    const databasePath = "/src/functions/database.js";
    require(executedDir + databasePath).load();

    // will not be required if all data is loaded into memory
    account_f.handler.initialize();
    savehandler_f.initialize();
    locale_f.handler.initialize();
    preset_f.handler.initialize();

    global.mods_f.TamperModLoad(); // TamperModLoad
    bundles_f.handler.initialize();
    logger.logInfo("Starting server...");
    this._serverStart();
  }
}

module.exports.server = new Server();
