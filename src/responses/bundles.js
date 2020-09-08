"use strict";

function getBundles(url, info, sessionID) {
    let local = serverConfig.ip === "127.0.0.1";
    return response_f.noBody(bundles_f.bundlesServer.getBundles(local));
}

function getBundle(url, info, sessionID) {
    return "BUNDLE";
}

router.addStaticRoute("/singleplayer/bundles/", getBundles);
router.addDynamicRoute(".bundle", getBundle);