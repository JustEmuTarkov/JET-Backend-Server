"use strict";
class LocaleServer {
    constructor() {
        this.languages = {};
        this.menu = {};
        this.global = {};
    }

    initialize() {
        this.languages = json.parse(json.read(db.user.cache.languages));

        for (let lang in db.locales) {
			let menuFile = (json.exist(db.user.cache["locale_menu_" + lang.toLowerCase()])?db.user.cache["locale_menu_" + lang.toLowerCase()]:db.locales[lang].menu);
            this.menu[lang] = json.parse(json.read(menuFile));
            this.global[lang] = json.parse(json.read(db.user.cache["locale_" + lang.toLowerCase()]));
        }
    }

    getLanguages() {
        return this.languages;
    }
    
    getMenu(lang = "en") {
		if(typeof this.menu[lang] == "undefined")
			return this.menu["en"];
        return this.menu[lang];
    }
    
    getGlobal(lang = "en") {
		if(typeof this.global[lang] == "undefined")
			return this.global["en"];
        return this.global[lang];
    }
}

module.exports.localeServer = new LocaleServer();