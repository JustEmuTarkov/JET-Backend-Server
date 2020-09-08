"use strict";
const fs = require('fs');

class LocaleServer {
    constructor() {
        this.languages = {};
        this.menu = {};
        this.global = {};
    }

    initialize() {
        this.languages = json.parse(json.read(db.user.cache.languages));

        for (let lang in db.locales) {
			let menuFile = (fs.existsSync(db.user.cache["locale_menu_" + lang.toLowerCase()])?db.user.cache["locale_menu_" + lang.toLowerCase()]:db.locales[lang].menu);
            this.menu[lang] = json.parse(json.read(menuFile));
            this.global[lang] = json.parse(json.read(db.user.cache["locale_" + lang.toLowerCase()]));
        }
    }

    getLanguages() {
        return this.languages;
    }
    
    getMenu(lang = "en") {
        return this.menu[lang];
    }
    
    getGlobal(lang = "en") {
        return this.global[lang];
    }
}

module.exports.localeServer = new LocaleServer();