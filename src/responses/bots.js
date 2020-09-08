"use strict";

function getBots(url, info, sessionID) {
    return response_f.getBody(bots_f.generate(info, sessionID));
}

router.addStaticRoute("/client/game/bot/generate", getBots);
