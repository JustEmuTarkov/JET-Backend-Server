"use strict";

class Router {
  constructor() {
    this.responseClass = require(executedDir + "/src/functions/response.js").responses;
  }

  getResponse(req, body, sessionID) {
    console.log(body, sessionID);
    let output = "";
    let url = req.url;
    let info = {};
    if (typeof body != "object") {
      /* parse body */
      if (body !== "") {
        info = fileIO.parse(body);
      }
    } else {
      if (url.includes("/server/config") && !url.includes(".css")) {
        info = body;
      }
    }
    /* remove retry from URL */
    if (url.includes("?retry=")) {
      url = url.split("?retry=")[0];
    }

    /* route request */
    if (url in this.responseClass.staticResponses) {
      output = this.responseClass.staticResponses[url](url, info, sessionID);
    } else {
      for (let key in this.responseClass.dynamicResponses) {
        if (url.includes(key)) {
          output = this.responseClass.dynamicResponses[key](url, info, sessionID);
          break; // hit only first request that matches and disband searching
        }
      }
    }

    return output;
  }
}

module.exports.router = new Router();
