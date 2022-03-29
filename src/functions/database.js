"use strict";

const { logger } = require("../../core/util/logger");
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
  if (!_database.hideout) _database.hideout = {};

  _database.hideout.settings = fileIO.readParsed("./" + db.hideout.settings);
  if (typeof _database.hideout.settings.data != "undefined") {
    _database.hideout.settings = _database.hideout.settings.data;
  }

  _database.hideout.areas = fileIO.readParsed("./" + db.user.cache.hideout_areas);
  if (typeof _database.hideout.areas.data != "undefined") {
    _database.hideout.areas = _database.hideout.areas.data;
  }

  _database.hideout.production = fileIO.readParsed("./" + db.user.cache.hideout_production);
  if (typeof _database.hideout.production.data != "undefined") {
    _database.hideout.production = _database.hideout.production.data;
  }

  _database.hideout.scavcase = fileIO.readParsed("./" + db.user.cache.hideout_scavcase);
  if (typeof _database.hideout.scavcase.data != "undefined") {
    _database.hideout.scavcase = _database.hideout.scavcase.data;
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
  _database.quests = fileIO.readParsed("./" + db.user.cache.quests);
  if (typeof _database.quests.data != "undefined") _database.quests = _database.quests.data;
}
function _load_CustomizationData() {
  _database.customization = fileIO.readParsed("./" + db.user.cache.customization);
  if (typeof _database.customization.data != "undefined") _database.customization = _database.customization.data;
}
function _load_LocaleData() {
  _database.languages = fileIO.readParsed("./" + db.user.cache.languages);
  _database.locales = { menu: {}, global: {} };
  for (let lang in db.locales) {
    let menuFile = fileIO.exist(db.user.cache["locale_menu_" + lang.toLowerCase()]) ? db.user.cache["locale_menu_" + lang.toLowerCase()] : db.locales[lang].menu;

    _database.locales.menu[lang] = fileIO.readParsed("./" + menuFile);
    if (typeof _database.locales.menu[lang].data != "undefined") {
      _database.locales.menu[lang] = _database.locales.menu[lang].data;
    }

    _database.locales.global[lang] = fileIO.readParsed("./" + db.user.cache["locale_" + lang.toLowerCase()]);
    if (typeof _database.locales.global[lang].data != "undefined") {
      _database.locales.global[lang] = _database.locales.global[lang].data;
    }
  }
}
function _load_LocationData() {
  var _locations = fileIO.readParsed("./" + db.user.cache.locations);
  _database.locations = {};
  for (let _location in _locations) {
    _database.locations[_location] = _locations[_location];
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
