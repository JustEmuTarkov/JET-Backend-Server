"use strict";

function load() {
    bundles_f.bundlesServer.initialize();
}

server.addStartCallback("loadBundles", load);