"use strict";
class LocaleServer {
    constructor() {
        this.languages = {};
        this.menu = {};
        this.global = {};
    }

    initialize() {
        this.languages = fileIO.readParsed(db.user.cache.languages);

        for (let lang in db.locales) {
			let menuFile = (fileIO.exist(db.user.cache["locale_menu_" + lang.toLowerCase()])?db.user.cache["locale_menu_" + lang.toLowerCase()]:db.locales[lang].menu);
            this.menu[lang] = fileIO.readParsed(menuFile);
			if(typeof this.menu[lang].data != "undefined"){
				this.menu[lang] = this.menu[lang].data;
			}
            this.global[lang] = fileIO.readParsed(db.user.cache["locale_" + lang.toLowerCase()]);
			if(typeof this.global[lang].data != "undefined"){
				this.global[lang] = this.global[lang].data;
			}
			// putting some watermarking inside game
			// later separate this into single languages and put it below this forloop
			this.global[lang].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Attention! This is Emulated version of \"Escape from Tarkov\". Provided by JustEmuTarkov Team (justemutarkov.eu).";
			this.global[lang].interface["NDA free warning"] = "If you like this game make sure to support official creators of this game (BattleState Games)";
			this.global[lang].interface["Offline raid description"] = "You are now entering an emulated version of a Tarkov raid. This emulated raid has all the features of a live version, but it has no connection to BSG's servers, and stays local on your PC.\nOther PMCs will spawn as emulated AI, and will spawn with randomized gear, levels, inventory, and names. This means you can loot, kill, and extract as you would online, and keep your inventory when you extract, but you cannot bring this loot into live EFT servers.\nIf you have any questions, don't hesitate to join the JustEmuTarkov Discord for assistance.";
        }
		// here if we gonna have language translations :)
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

module.exports.handler = new LocaleServer();