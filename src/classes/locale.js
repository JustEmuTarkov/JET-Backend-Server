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
        }
		this.global['en'].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Attention! This is Emulated version of \"Escape from Tarkov\". Provided by JustEmuTarkov Team (justemutarkov.eu).";
		this.global['en'].interface["NDA free warning"] = "If you like this game make sure to support official creators of this game (BattleState Games).";
		this.global['en'].interface["Offline raid description"] = "You are now entering an emulated version of a Tarkov raid. This emulated raid has all the features of a live version, but it has no connection to BSG's servers, and stays local on your PC.\nOther PMCs will spawn as emulated AI, and will spawn with randomized gear, levels, inventory, and names. This means you can loot, kill, and extract as you would online, and keep your inventory when you extract, but you cannot bring this loot into live EFT servers.\nIf you have any questions, don't hesitate to join the JustEmuTarkov Discord for assistance.";
		
		this.global['ru'].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Внимание! Это оффлайн версия игры \"Escape from Tarkov\", предоставленная командой JustEmuTarkov (justemutarkov.eu).";
		this.global['ru'].interface["NDA free warning"] = "Поддержите создателей Escape From Tarkov - BattleState Games, если вам нравится эта игра.";
		this.global['ru'].interface["Offline raid description"] = "Вы входите в оффлайн версию рейда. Он включает в себя все возможности оффициальной версии, но не имеет подключения к серверам BSG и работает локально на вашем ПК.\nДругие ЧВК появятся как ИИ и будут иметь случайное снаряжение, уровень, инвентарь и имена. Вы можете собирать лут, убивать других ЧВК и выходить с рейда так-же, как в онлайн версии, ваш инвентарь будет сохранен при выходе, но вы не можете перенести ваши вещи на оффициальную версию или наоборот.\nЕсли у вас есть вопросы, то присоедитесь к Discord серверу JustEmuTarkov.";
		
		this.global['ge'].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Achtung! Dies ist eine Emulierte Version von Escape From Tarkov! Zur verfügung gestellt vom JustEmutTarkov Team (justemutarkov.eu).";
		this.global['ge'].interface["NDA free warning"] = "Wenn dir das Spiel gefällt unterstütze die Entwickler des Spiels (BattleState Games)";
		this.global['ge'].interface["Offline raid description"] = "Du Betrittst eine Emulierte Version von Escape From Tarkov. Diese hat keine Verbindung zu den Servern von BattleState-Games und bleibt komplett auf deinem Computer. PMC Bots werden Spawnen mit zufälligen Namen, Level und Ausrüstung. Das bedeutet das du alles machen kannst was du auch in der Live-Version machen kannst sogar dein Inventar und dein Fortschritt im Spiel wird gespeichert. Falls du irgendwelche Fragen haben solltest kannst du dem JustEmuTarkov Discord Server beitreten!";
		
		this.global['fr'].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Attention! Ceci est la version émuler d'\"Escape from Tarkov\". Fournit par JustEmuTarkov Team (justemutarkov.eu).";
		this.global['fr'].interface["NDA free warning"] = "Si vous aimez ce jeu, n'oubliez pas de supporter les créateurs officiels de ce jeu (BattleState Games).";
		this.global['fr'].interface["Offline raid description"] = "Vous entez maintenant une version émuler d'un raid de Tarkov. Ce raid émulé contient toutes les fonctionnalités de la version \"live\" mais n'as pas de connexion au serveurs de BSG. Les autres joueurs dans le raid seront une AI qui apparaît avec des armures/niveaux/inventaire/nom aléatoires. Sa veut dire que vous pouvez loot, tuer et s'extraire de la map comme vous le feriez online, et garder votre inventaire quand vous vous enfuyez, mais vous pouvez pas transférer ce loot dans la version \"live\" du jeu. Si vous avez des questions, n'hésitez pas a rejoindre notre serveur discord \"JustEmuTarkov\" pour recevoir plus d'assistance.";
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