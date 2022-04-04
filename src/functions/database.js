"use strict";

const { cache } = require("../cache/routes");

function _load_Globals() {
  _database.globals = fileIO.readParsed("./" + db.base.globals);
  //allow to use file with {data:{}} as well as {}
  if (typeof _database.globals.data != "undefined") _database.globals = _database.globals.data;
}
function _load_GameplayConfig() {
  _database.gameplayConfig = fileIO.readParsed("./user/configs/gameplay.json");
  _database.gameplay = _database.gameplayConfig;
}
function _load_BotsData() {
  _database.bots = {};
  for (let botType in db.bots) {
    _database.bots[botType] = {};
    let difficulty_easy = null;
    let difficulty_normal = null;
    let difficulty_hard = null;
    let difficulty_impossible = null;
    if (typeof db.bots[botType].difficulty != "undefined") {
      if (typeof db.bots[botType].difficulty.easy != "undefined") difficulty_easy = fileIO.readParsed("./" + db.bots[botType].difficulty.easy);
      if (typeof db.bots[botType].difficulty.normal != "undefined") difficulty_normal = fileIO.readParsed("./" + db.bots[botType].difficulty.normal);
      if (typeof db.bots[botType].difficulty.hard != "undefined") difficulty_hard = fileIO.readParsed("./" + db.bots[botType].difficulty.hard);
      if (typeof db.bots[botType].difficulty.impossible != "undefined") difficulty_impossible = fileIO.readParsed("./" + db.bots[botType].difficulty.impossible);
    }
    _database.bots[botType].difficulty = {
      easy: difficulty_easy,
      normal: difficulty_normal,
      hard: difficulty_hard,
      impossible: difficulty_impossible,
    };
    _database.bots[botType].appearance = fileIO.readParsed("./" + db.bots[botType].appearance);
    _database.bots[botType].chances = fileIO.readParsed("./" + db.bots[botType].chances);
    _database.bots[botType].experience = fileIO.readParsed("./" + db.bots[botType].experience);
    _database.bots[botType].generation = fileIO.readParsed("./" + db.bots[botType].generation);
    _database.bots[botType].health = fileIO.readParsed("./" + db.bots[botType].health);
    _database.bots[botType].inventory = {};
    for (const name in db.bots[botType].inventory) {
      _database.bots[botType].inventory[name] = fileIO.readParsed("./" + db.bots[botType].inventory[name]);
    }
    //_database.bots[botType].inventory = fileIO.readParsed("./" + db.bots[botType].inventory);
    _database.bots[botType].names = fileIO.readParsed("./" + db.bots[botType].names);
  }
}
function _load_CoreData() {
  _database.core = {};
  _database.core.botBase = fileIO.readParsed("./" + db.base.botBase);
  _database.core.botCore = fileIO.readParsed("./" + db.base.botCore);
  _database.core.fleaOffer = fileIO.readParsed("./" + db.base.fleaOffer);
  _database.core.matchMetrics = fileIO.readParsed("./" + db.base.matchMetrics);
}
function _load_ItemsData() {
  _database.items = fileIO.readParsed("./" + db.user.cache.items);
  if (typeof _database.items.data != "undefined") _database.items = _database.items.data;
  _database.templates = fileIO.readParsed("./" + db.user.cache.templates);
  if (typeof _database.templates.data != "undefined") _database.templates = _database.templates.data;

  let itemHandbook = _database.templates.Items;
  _database.itemPriceTable = {};
  for(let item of itemHandbook)
  {
    _database.itemPriceTable[item.Id] = item.Price;
  }

}
function _load_HideoutData() {

  _database.hideout = { settings: {}, areas: [], production: [], scavcase: []};

  _database.hideout.settings = fileIO.readParsed("./" + db.hideout.settings);
  if (typeof _database.hideout.settings.data != "undefined") {
    _database.hideout.settings = _database.hideout.settings.data;
  }
  for(let area in db.hideout.areas){
    _database.hideout.areas.push(fileIO.readParsed("./" + db.hideout.areas[area]));
  }
  for(let production in db.hideout.production){
    _database.hideout.production.push(fileIO.readParsed("./" + db.hideout.production[production]));
  }
  for(let scavcase in db.hideout.scavcase){
    _database.hideout.scavcase.push(fileIO.readParsed("./" + db.hideout.scavcase[scavcase]));
  }

  // apply production time divider
  for (let id in _database.hideout.areas) {
    for (let id_stage in _database.hideout.areas[id].stages) {
      let stage = _database.hideout.areas[id].stages[id_stage];
      if (stage.constructionTime != 0 && stage.constructionTime > _database.gameplay.hideout.productionTimeDivide_Areas) {
        stage.constructionTime = stage.constructionTime / _database.gameplay.hideout.productionTimeDivide_Areas;
      }
    }
  }
  for (let id in _database.hideout.production) {
    if (_database.hideout.production[id].productionTime != 0 && _database.hideout.production[id].productionTime > _database.gameplay.hideout.productionTimeDivide_Production) {
      _database.hideout.production[id].productionTime = _database.hideout.production[id].productionTime / _database.gameplay.hideout.productionTimeDivide_Production;
    }
  }
  for (let id in _database.hideout.scavcase) {
    if (_database.hideout.production[id].ProductionTime != 0 && _database.hideout.production[id].ProductionTime > _database.gameplay.hideout.productionTimeDivide_ScavCase) {
      _database.hideout.production[id].ProductionTime = _database.hideout.production[id].ProductionTime / _database.gameplay.hideout.productionTimeDivide_ScavCase;
    }
  }
}
function _load_QuestsData() {
  // this should load quests depending on file content if its single quest it will be pushed to the list
  // if its quests array containing more then 1 quest it will be loaded as for loop push 
  // unless database quests array is empty then it will just everride the empty array
  _database.quests = [];
  for(let quest in db.quests){
    let questData = fileIO.readParsed("./" + db.quests[quest]);
    if(typeof questData.length != "undefined"){
      if(_database.quests.length == 0)
      {
        _database.quests = questData;
      } else {
        for(let q in questData)
        {
          _database.quests.push(questData[q]);
        }
      }
		} else {
			_database.quests.push(questData);
		}
  }
}
function _load_CustomizationData() {
  _database.customization = {};
  for (let file in db.customization) {
    let data = fileIO.readParsed(db.customization[file]);
    // make sure it has _id so we gonna use that
		if(Object.keys(data)[0].length == 24)
    {
			for(let q in data)
			{
				_database.customization[q] = data[q];
			}
		} else {
      // if sile doesnt contain _id use file name
			_database.customization[file] = data;
		}
  }
}
function _load_LocaleData() {
/*
  folder structure must be always like this

  db.locales: {
    en: [
      en.json,
      locale.json,
      menu.json
    ]
  }
  tag of folder need to match the tag in first file
*/
  _database.languages = [];
  _database.locales = { menu: {}, global: {} };

  for(let langTag of db.locales){
    langTag = langTag.toLowerCase(); // make sure its always lower case
    _database.languages.push(fileIO.readParsed("./" + db.locales[langTag][langTag]));
    _database.locales.menu[langTag] = fileIO.readParsed("./" + db.locales[langTag].menu);
    _database.locales.global[langTag] = fileIO.readParsed("./" + db.locales[langTag].locale);
  }
}

function Create_LootGameUsableStruct(item_data, Type){
	let isStatic = false;
	let useGravity = false;
	let randomRotation = false;
	let position = {x:0,y:0,z:0};
	let rotation = {x:0,y:0,z:0};
	let IsGroupPosition = false;
	let GroupPositions = [];
	
	if(typeof item_data.IsStatic != "undefined")
		isStatic = item_data.IsStatic;
	if(typeof item_data.useGravity != "undefined")
		useGravity = item_data.useGravity;
	if(typeof item_data.randomRotation != "undefined")
		randomRotation = item_data.randomRotation;

	if(item_data.Position != 0 && item_data.Position != "0")
	{
		position.x = item_data.Position.x;
		position.y = item_data.Position.y;
		position.z = item_data.Position.z;
	}
	if(item_data.Rotation != 0 && item_data.Rotation != "0")
	{
		rotation.x = item_data.Rotation.x;
		rotation.y = item_data.Rotation.y;
		rotation.z = item_data.Rotation.z;
	}
	if(typeof item_data.IsGroupPosition != "undefined"){
		IsGroupPosition = item_data.IsGroupPosition;
		GroupPositions = item_data.GroupPositions;
	}
  let structure = {
		"Id": item_data.id,
		"IsStatic": isStatic,
		"useGravity": useGravity,
		"randomRotation": randomRotation,
		"Position": position,
		"Rotation": rotation,
		"IsGroupPosition": IsGroupPosition,
		"GroupPositions": GroupPositions,
		"Items": item_data.Items
	};
  if(Type == "static" || Type == "mounted"){
    const Root = typeof item_data.Items[0] == "string" ? item_data.id : item_data.Items[0]._id;
    structure["Root"] = Root;
  }
	return structure;
}
function _load_LocationData() {

  for (let name in db.locations.base) {
		let _location = { "base": {}, "loot": {}};
		_location.base = fileIO.readParsed(db.locations.base[name]);
		_location.loot = {forced: [], mounted: [], static: [], dynamic: []};
		if(typeof db.locations.loot[name] != "undefined"){
			let loot_data = fileIO.readParsed(db.locations.loot[name]);
			for(let type in loot_data){
				for(item of loot_data[type]){
					_location.loot[type].push(Create_LootGameUsableStruct(item))
				}
			}
		}
		_database.locations[name] = _location;
	}
  _database.core.location_base = fileIO.readParsed("./" + db.base.locations);
  _database.locationConfigs = {};
  _database.locationConfigs["StaticLootTable"] = fileIO.readParsed("./" + db.locations.StaticLootTable);
  _database.locationConfigs["DynamicLootTable"] = fileIO.readParsed("./" + db.locations.DynamicLootTable);
}
function _load_TradersData() {
  _database.traders = {};
  for (let traderID in db.traders) {
    _database.traders[traderID] = { base: {}, assort: {}, categories: {} };
    _database.traders[traderID].base = fileIO.readParsed("./" + db.traders[traderID].base);
    _database.traders[traderID].categories = fileIO.readParsed("./" + db.traders[traderID].categories);
    _database.traders[traderID].base.sell_category = _database.traders[traderID].categories; // override trader categories

    _database.traders[traderID].assort = fileIO.readParsed("./" + db.user.cache["assort_" + traderID]);

    if (typeof _database.traders[traderID].assort.data != "undefined") _database.traders[traderID].assort = _database.traders[traderID].assort.data;
    if (_database.traders[traderID].base.repair.price_rate === 0) {
      _database.traders[traderID].base.repair.price_rate = 100;
      _database.traders[traderID].base.repair.price_rate *= _database.gameplayConfig.trading.repairMultiplier;
      _database.traders[traderID].base.repair.price_rate -= 100;
    } else {
      _database.traders[traderID].base.repair.price_rate *= _database.gameplayConfig.trading.repairMultiplier;
      if (_database.traders[traderID].base.repair.price_rate == 0) _database.traders[traderID].base.repair.price_rate = -1;
    }
    if (_database.traders[traderID].base.repair.price_rate < 0) {
      _database.traders[traderID].base.repair.price_rate = -100;
    }
  }
}
function _load_WeatherData() {
  _database.weather = fileIO.readParsed("./" + db.user.cache.weather);
  let i = 0;
  for (let weather in db.weather) {
    logger.logInfo("Loaded Weather: ID: " + i++ + ", Name: " + weather);
  }
}
exports.load = () => {

  cache();

  logger.logDebug("Load: 'Core'");
  _load_CoreData();
  logger.logDebug("Load: 'Globals'");
  _load_Globals();
  logger.logDebug("Load: 'Gameplay'");
  _load_GameplayConfig();
  logger.logDebug("Load: 'Bots'");
  _load_BotsData();
  logger.logDebug("Load: 'Hideout'");
  _load_HideoutData();
  logger.logDebug("Load: 'Quests'");
  _load_QuestsData();
  logger.logDebug("Load: 'Items'");
  _load_ItemsData();
  logger.logDebug("Load: 'Customizations'");
  _load_CustomizationData();
  logger.logDebug("Load: 'Locales'");
  _load_LocaleData();
  logger.logDebug("Load: 'Locations'");
  _load_LocationData();
  logger.logDebug("Load: 'Traders'");
  _load_TradersData();
  logger.logDebug("Load: 'Weather'");
  _load_WeatherData();
  logger.logDebug("Database loaded");
};
