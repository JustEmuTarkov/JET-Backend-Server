"use strict";

class Server {
  constructor() {
    this.tarkovSend = require("./tarkovSend.js").struct;
    this.name = serverConfig.name;
    this.ip = serverConfig.ip;
    this.port = serverConfig.port;
    this.backendUrl = "https://" + this.ip + ":" + this.port;
    this.second_backendUrl = "https://" + serverConfig.ip_backend + ":" + this.port;
    this.buffers = {}; // THIS SEEMS TO FIX THAT FIRST ERROR (Server.putInBuffer)
    this.initializeCallbacks();
  }


  initializeCallbacks() {
    const callbacks = require(executedDir + "/src/functions/callbacks.js").callbacks;

    this.receiveCallback = callbacks.getReceiveCallbacks();
    this.respondCallback = callbacks.getRespondCallbacks();

    logger.logSuccess("Create: Receive Callback");
  }

  resetBuffer = (sessionID) => { this.buffers[sessionID] = undefined; }
  getFromBuffer = (sessionID) => (this.buffers[sessionID]) ? this.buffers[sessionID].buffer : "";
  getName = () => this.name;
  getIp = () => this.ip;
  getPort = () => this.port;
  getBackendUrl = () => this.second_backendUrl != null ? this.second_backendUrl : this.backendUrl;
  getVersion = () => global.core.constants.ServerVersion;

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

  sendResponse(sessionID, req, resp, body) {
    let output = "";
    //check if page is static html page or requests like 
    if (this.tarkovSend.sendStaticFile(req, resp))
      return;

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

  handleAsyncRequest = (req, resp) => new Promise(resolve => { resolve(this.handleRequest(req, resp)); });

  // Logs the requests made by users. Also stripped from bullshit requests not important ones.
  requestLog(req, sessionID) {
    let IP = req.connection.remoteAddress.replace("::ffff:", "");
    IP = IP == "127.0.0.1" ? "LOCAL" : IP;
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
  }

  handleRequest(req, resp) {
    new Promise(resolve => {
      const sessionID = (consoleResponse.getDebugEnabled()) ? consoleResponse.getSession() : utility.getCookies(req)["PHPSESSID"];
      this.requestLog(req, sessionID);
      switch (req.method) {
        case "GET":
          {
            server.sendResponse(sessionID, req, resp, "");
            resolve(true)
          }
        case "POST":
          {
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
                resolve(true);
                return;
              }
              internal.zlib.inflate(data, function (err, body) {
                let jsonData = body !== undefined && body !== null && body !== "" ? body.toString() : "{}";
                server.sendResponse(sessionID, req, resp, jsonData);
                resolve(true);
              });
            });

          }
        case "PUT":
          {
            // req.on("data", function (data) {
            //   // receive data
            //   if ("expect" in req.headers) {

            //     const requestLength = parseInt(req.headers["content-length"]);

            //     if (!server.putInBuffer(sessionID, data, requestLength)) {
            //       resp.writeContinue();
            //     }
            //   }
            // })
            // .on("end", function () {
            //   let data = server.getFromBuffer(sessionID);
            //   server.resetBuffer(sessionID);

            //   internal.zlib.inflate(data, function (err, body) {
            //     let jsonData = body !== undefined && body !== null && body !== "" ? body.toString() : "{}";
            //     server.sendResponse(sessionID, req, resp, jsonData);
            //     resolve(true);
            //   });
            // });
            resolve(true);
          }
        default:
          {
            resolve(true);
          }
      }
    });
  }

  CreateServer() {
    let backend = this.backendUrl;
    /* create server */
    const certificate = require("./certGenerator.js").certificate;

    let httpsServer = internal.https.createServer(certificate.generate());
    httpsServer.on('request', async (req, res) => {
      this.handleAsyncRequest(req, res);
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

    httpsServer.listen(this.port, this.ip, function () {
      logger.logSuccess(`Server is working at: ${backend}`);
    });
  }

  softRestart() {
    logger.logInfo("[SoftRestart]: Reloading Database");
    global.mods_f.ResModLoad();
    const databasePath = "/src/functions/database.js";
    require(process.cwd() + databasePath).load();
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
    logger.logDebug("Loading Database...");
    const databasePath = "/src/functions/database.js";
    const executedDir = internal.process.cwd();
    logger.logDebug(`ExecutedDir: ${executedDir}`);
    require(executedDir + databasePath).load();

    // will not be required if all data is loaded into memory
    logger.logDebug("Initialize account class...")
    account_f.handler.initialize();
    logger.logDebug("Initialize save handler class...")
    savehandler_f.initialize();
    logger.logDebug("Initialize locale class...")
    locale_f.handler.initialize();
    logger.logDebug("Initialize preset class...")
    preset_f.handler.initialize();

    logger.logDebug("Load Tamper Mods...")
    global.mods_f.TamperModLoad(); // TamperModLoad
    logger.logDebug("Initialize bundles class...")
    bundles_f.handler.initialize();
    logger.logInfo("Starting server...");
    this.CreateServer();
  }
}

module.exports.server = new Server();
