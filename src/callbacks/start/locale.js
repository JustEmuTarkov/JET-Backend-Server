"use strict";

function load() {
    locale_f.localeServer.initialize();
}

server.addStartCallback("loadLocales", load);