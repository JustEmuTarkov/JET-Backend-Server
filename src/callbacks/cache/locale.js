exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }
    for (let locale in db.locales) {
        let base = { "interface": {}, "enum": [], "error": {}, "mail": {}, "quest": {}, "preset": {}, "handbook": {}, "season": {}, "templates": {}, "locations": {}, "banners": {}, "trading": {}}
        let inputNode = db.locales[locale];
        let inputDir = [
            "banners",
            "handbook",
            "locations",
            "mail",
            "preset",
            "quest",
            "season",
            "templates",
            "trading"
        ];

        logger.logInfo(`Caching: locale_${locale}.json + locale_menu_${locale}.json`);

        base.interface = json.parse(json.read(inputNode.interface));
        base.error = json.parse(json.read(inputNode.error));

        for (let name of inputDir) {
			// loop through all inputDir's
			base[name] = json.parse(json.read(`./db/locales/${locale}/_${name}.json`));

        }
		let menu = json.parse(json.read(inputNode.menu));
        json.write(`user/cache/locale_${locale}.json`, base);
        json.write(`user/cache/locale_menu_${locale}.json`, menu);
    }
}