"use strict";

function load() {
    trader_f.traderServer.initialize();
}

server.addStartCallback("loadTraders", load);