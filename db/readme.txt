Languages can be loaded in 2 ways
1. less files -> loading locale.json in language folder and menu.json and languagefoldername.json for example en.json
2. more files -> loading "banners", "customization", "handbook", "locations", "mail", "preset", "quest", "season", "templates", "trading" as json files and then loading menu.json and en.json as folder name


Changed:
db.cacheBase -> db.base
db.cacheBase.traders.traderId -> db.traders.traderId.(base|categories|questassort|suits|dialogue)
db.assort.traderId.files -> db.traders.traderId.(assort)
db.locations.locationName -> bd.locations.(base|loot).locationName
db.items(removed Node_number_ from name - can still use the old naming)
remove templates/quests.json
use of quests[filename]