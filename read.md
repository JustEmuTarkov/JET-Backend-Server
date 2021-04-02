Changed:

db.cacheBase -> db.base
db.cacheBase.traders.traderId -> db.traders.traderId.(base|categories|questassort|suits|dialogue)
db.assort.traderId.files -> db.traders.traderId.(assort)
db.locations.locationName -> bd.locations.(base|loot).locationName
db.items(removed Node_number_ from name - can still use the old naming)
remove templates/quests.json
use of quests[filename]