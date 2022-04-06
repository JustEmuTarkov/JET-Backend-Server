"use strict";

function _load_Globals() {
  _database.globals = fileIO.readParsed("./" + db.base.globals);
  //allow to use file with {data:{}} as well as {}
  if (typeof _database.globals.data != "undefined") _database.globals = _database.globals.data;
}

function _load_ClusterConfig() {
  _database.clusterConfig = fileIO.readParsed("./" + db.user.configs.cluster);
}

function _load_GameplayConfig() {
  global._database.gameplay = fileIO.readParsed("./user/configs/gameplay.json");
}

function _load_BlacklistConfig() {
  _database.blacklist = fileIO.readParsed("./" + db.user.configs.blacklist);
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
  }
  _database.bots.names = fileIO.readParsed("./" + db.base.botNames);
}

function _load_CoreData() {
  _database.core = {};
  _database.core.botBase = fileIO.readParsed("./" + db.base.botBase);
  _database.core.botCore = fileIO.readParsed("./" + db.base.botCore);
  _database.core.fleaOffer = fileIO.readParsed("./" + db.base.fleaOffer);
  _database.core.matchMetrics = fileIO.readParsed("./" + db.base.matchMetrics);
}

function _load_ItemsData() {

  global._database.items = {};
  let itemNodeFiles = db.items;
  for (let file in itemNodeFiles) {
    for (let items of fileIO.readParsed(itemNodeFiles[file])) {
      if (items._id == undefined) {
        logger.logWarning(`[Loading ItemsDB] file: ${file} looks to contain corrupted data`)
        continue;
      }
      global._database.items[items._id] = items;
    }
  }

  global._database.templates = {};
  global._database.templates.Categories = fileIO.readParsed(db.templates.categories)
  global._database.templates.Items = fileIO.readParsed(db.templates.items);

  const itemHandbook = _database.templates.Items;
  _database.itemPriceTable = {};
  for (let item in itemHandbook) {
    _database.itemPriceTable[item.Id] = item.Price;
  }
}

function _load_HideoutData() {

  _database.hideout = { settings: {}, areas: [], production: [], scavcase: [] };

  _database.hideout.settings = fileIO.readParsed("./" + db.hideout.settings);
  if (typeof _database.hideout.settings.data != "undefined") {
    _database.hideout.settings = _database.hideout.settings.data;
  }
  for (let area in db.hideout.areas) {
    _database.hideout.areas.push(fileIO.readParsed("./" + db.hideout.areas[area]));
  }
  for (let production in db.hideout.production) {
    _database.hideout.production.push(fileIO.readParsed("./" + db.hideout.production[production]));
  }
  for (let scavcase in db.hideout.scavcase) {
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
  _database.quests = fileIO.readParsed("./" + db.quests.quests);
  if (typeof _database.quests.data != "undefined") _database.quests = _database.quests.data;

  /*   // this should load quests depending on file content if its single quest it will be pushed to the list
    // if its quests array containing more then 1 quest it will be loaded as for loop push 
    // unless database quests array is empty then it will just everride the empty array
    _database.quests = [];
    for (let quest in db.quests) {
      let questData = fileIO.readParsed("./" + db.quests[quest]);
      if (typeof questData.length != "undefined") {
        if (_database.quests.length == 0) {
          _database.quests = questData;
        } else {
          for (let q in questData) {
            _database.quests.push(questData[q]);
          }
        }
      } else {
        _database.quests.push(questData);
      }
    } */
}
function _load_CustomizationData() {
  _database.customization = {};
  for (let file in db.customization) {
    let data = fileIO.readParsed(db.customization[file]);
    // make sure it has _id so we gonna use that
    if (Object.keys(data)[0].length == 24) {
      for (let q in data) {
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

  for (let lang in db.locales) {
    lang = lang.toLowerCase(); // make sure its always lower case

    if (typeof db.locales[lang][lang] == "undefined")
      throw "db.locales[" + lang + "][" + lang + "] not found";

    if (typeof db.locales[lang][lang] == "object")
      throw "db.locales[" + lang + "][" + lang + "] is not a path";

    const languages = fileIO.readParsed(db.locales[lang][lang]);
    _database.languages.push(languages);

    //_database.languages.push(fileIO.readParsed("./" + db.locales[langTag][langTag]));
    _database.locales.menu[lang] = fileIO.readParsed("./" + db.locales[lang].menu);
    if (typeof _database.locales.menu[lang].data != "undefined") {
      _database.locales.menu[lang] = _database.locales.menu[lang].data;
    }
    _database.locales.global[lang] = fileIO.readParsed("./" + db.locales[lang].locale);
    if (typeof _database.locales.global[lang].data != "undefined") {
      _database.locales.global[lang] = _database.locales.global[lang].data;
    }
  }

  //original code
  /*   _database.languages = fileIO.readParsed("./" + db.user.cache.languages);
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
    } */
}

function Create_LootGameUsableStruct(item_data, Type) {
  let isStatic = false;
  let useGravity = false;
  let randomRotation = false;
  let position = { x: 0, y: 0, z: 0 };
  let rotation = { x: 0, y: 0, z: 0 };
  let IsGroupPosition = false;
  let GroupPositions = [];

  if (typeof item_data.IsStatic != "undefined")
    isStatic = item_data.IsStatic;
  if (typeof item_data.useGravity != "undefined")
    useGravity = item_data.useGravity;
  if (typeof item_data.randomRotation != "undefined")
    randomRotation = item_data.randomRotation;

  if (item_data.Position != 0 && item_data.Position != "0") {
    position.x = item_data.Position.x;
    position.y = item_data.Position.y;
    position.z = item_data.Position.z;
  }
  if (item_data.Rotation != 0 && item_data.Rotation != "0") {
    rotation.x = item_data.Rotation.x;
    rotation.y = item_data.Rotation.y;
    rotation.z = item_data.Rotation.z;
  }
  if (typeof item_data.IsGroupPosition != "undefined") {
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
  if (Type == "static" || Type == "mounted") {
    const Root = typeof item_data.Items[0] == "string" ? item_data.id : item_data.Items[0]._id;
    structure["Root"] = Root;
  }
  return structure;
}
function _load_LocationData() {
  _database.locations = {};
  for (let name in db.locations.base) {
    let _location = { "base": {}, "loot": {} };
    _location.base = fileIO.readParsed(db.locations.base[name]);
    _location.loot = { forced: [], mounted: [], static: [], dynamic: [] };
    if (typeof db.locations.loot[name] != "undefined") {
      let loot_data = fileIO.readParsed(db.locations.loot[name]);
      for (let type in loot_data) {
        for (let item of loot_data[type]) {
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
const LoadTraderAssort = (traderId) => {
  let base = { nextResupply: 0, items: [], barter_scheme: {}, loyal_level_items: {} };
  const assort = fileIO.readParsed(db.traders[traderId].assort);

  for (let item in assort) {
    let items;
    if (traderId != "ragfair") {
      if (utility.isUndefined(assort[item].items[0])) {
        let items = assort[item].items;

        /*
        copy properties of db item 
        There are a lot of properties missing and that is gay and retarded
        */

        items[0]["upd"] = Object.assign({}, items[0].upd);

        items[0].upd.UnlimitedCount = items[0].upd.UnlimitedCount;

        items[0].upd.StackObjectsCount = items[0].upd.StackObjectsCount;
        if (items[0].upd.BuyRestrictionsMax != "undefined") {
          items[0].upd.StackObjectsCount = items[0].upd.BuyRestrictionMax;
        }
      }
    } else {
      let items = assort[item].items;
      if (utility.isUndefined(items[0])) {
        items[0]["upd"] = {};
        items[0].upd["StackObjectsCount"] = 99;
      }
    }
    items = assort[item].items;
    for (let assort_item in items) {
      base.items.push(items[assort_item]);
    }
    base.barter_scheme[item] = assort[item].barter_scheme;
    base.loyal_level_items[item] = assort[item].loyalty;
  }

  /*   for (let item in assort) {
      if (traderId != "ragfair") {
        if (typeof assort[item].items[0] != "undefined") {
          let items = assort[item].items;
  
          assort[item].items[0] = { upd: { StackObjectsCount: assort[item].currentStack } };
          if (assort[item].default.unlimited)
            assort[item].items[0].upd["UnlimitedCount"] = true;
        }
      } else {
        if (typeof assort[item].items[0] != "undefined") {
          assort[item].items[0] = { upd: { StackObjectsCount: 9999 } };
        }
      }
      for (let assort_item in assort[item].items) {
        base.items.push(assort[item].items[assort_item]);
      }
      base.barter_scheme[item] = assort[item].barter_scheme;
      base.loyal_level_items[item] = assort[item].loyalty;
    } */
  //fileIO.write("./trader_assort.json", base);
  return base;
}

function _load_TradersData() {
  global._database.traders = {};
  for (let traderID in db.traders) {
    global._database.traders[traderID] = { base: {}, assort: {}, categories: {} };
    global._database.traders[traderID].base = fileIO.readParsed("./" + db.traders[traderID].base);
    global._database.traders[traderID].categories = fileIO.readParsed("./" + db.traders[traderID].categories);
    global._database.traders[traderID].base.sell_category = _database.traders[traderID].categories; // override trader categories

    // Loading Assort depending if its Fence or not
    if (traderID == "579dc571d53a0658a154fbec") {
      global._database.traders[traderID].base_assort = LoadTraderAssort(traderID);
      global._database.traders[traderID].assort = { nextResupply: 0, items: [], barter_scheme: {}, loyal_level_items: {} };
    } else {
      global._database.traders[traderID].assort = LoadTraderAssort(traderID);
    }
    // Loading Player Customizations For Buying
    if ("suits" in db.traders[traderID]) {
      if (typeof db.traders[traderID].suits == "string") {
        global._database.traders[traderID].suits = fileIO.readParsed(db.traders[traderID].suits);
      } else {
        let suitsTable = [];
        for (let file in db.traders[traderID].suits) {
          suitsTable.push(fileIO.readParsed(db.traders[traderID].suits[file]));
        }
        global._database.traders[traderID].suits = suitsTable;
      }
    }

    if (global._database.traders[traderID].base.repair.price_rate === 0) {
      global._database.traders[traderID].base.repair.price_rate = 100;
      global._database.traders[traderID].base.repair.price_rate *= global.global._database.gameplay.trading.repairMultiplier;
      global._database.traders[traderID].base.repair.price_rate -= 100;
    } else {
      global._database.traders[traderID].base.repair.price_rate *= global.global._database.gameplay.trading.repairMultiplier;
      if (global._database.traders[traderID].base.repair.price_rate == 0) global._database.traders[traderID].base.repair.price_rate = -1;
    }
    if (global._database.traders[traderID].base.repair.price_rate < 0) {
      global._database.traders[traderID].base.repair.price_rate = -100;
    }
  }
  //fileIO.write("./traders.json", global._database.traders);
}
/*   _database.traders = {};
  for (let traderID in db.traders) {
    _database.traders[traderID] = { base: {}, assort: {}, categories: {} };
    _database.traders[traderID].base = fileIO.readParsed("./" + db.traders[traderID].base);
    _database.traders[traderID].categories = fileIO.readParsed("./" + db.traders[traderID].categories);
    _database.traders[traderID].base.sell_category = _database.traders[traderID].categories; // override trader categories
    _database.traders[traderID].assort = fileIO.readParsed("./" + db.user.cache["assort_" + traderID]);
    if (typeof _database.traders[traderID].assort.data != "undefined") _database.traders[traderID].assort = _database.traders[traderID].assort.data;

    if (typeof db.traders[traderID].questassort != "undefined") {
      _database.traders[traderID].questassort = fileIO.readParsed("./" + db.traders[traderID].questassort);
    }


    if (_database.traders[traderID].base.repair.price_rate === 0) {
      _database.traders[traderID].base.repair.price_rate = 100;
      _database.traders[traderID].base.repair.price_rate *= global._database.gameplay.trading.repairMultiplier;
      _database.traders[traderID].base.repair.price_rate -= 100;
    } else {
      _database.traders[traderID].base.repair.price_rate *= global._database.gameplay.trading.repairMultiplier;
      if (_database.traders[traderID].base.repair.price_rate == 0) _database.traders[traderID].base.repair.price_rate = -1;
    }
    if (_database.traders[traderID].base.repair.price_rate < 0) {
      _database.traders[traderID].base.repair.price_rate = -100;
    }
  }
  _database.ragfair_offers = fileIO.readParsed("./" + db.user.cache.ragfair_offers);
} */

function _load_WeatherData() {
  _database.weather = [];
  let i = 0;
  for (let file in db.weather) {
    let filePath = db.weather[file];
    let fileData = fileIO.readParsed(filePath);

    logger.logInfo("Loaded Weather: ID: " + i++ + ", Name: " + file.replace(".json", ""));
    _database.weather.push(fileData);
  }
}

function GenerateRagfairOffersCache() {

  const findChildren = (itemIdToFind, assort) => {
    let Array = [];
    for (let itemFromAssort of assort) {
      if (itemFromAssort.parentId == itemIdToFind) {
        Array.push(itemFromAssort)
        Array = Array.concat(findChildren(itemFromAssort._id, assort));
      }
    }
    return Array;
  }
  const OfferBase = fileIO.readParsed(db.base.fleaOffer);
  const loadCache = (OFFER_BASE, itemsToSell, barter_scheme, loyal_level, trader, counter = 911) => {
    let offer = utility.DeepCopy(OFFER_BASE);
    const traderObj = global._database.traders[trader].base;
    offer._id = itemsToSell[0]._id;
    offer.intId = counter;
    offer.user = {
      "id": traderObj._id,
      "memberType": 4,
      "nickname": traderObj.surname,
      "rating": 1,
      "isRatingGrowing": true,
      "avatar": traderObj.avatar
    };
    offer.root = itemsToSell[0]._id;
    offer.items = itemsToSell;
    offer.requirements = barter_scheme;
    offer.loyaltyLevel = loyal_level;
    return offer;
  }
  let response = { "categories": {}, "offers": [], "offersCount": 100, "selectedCategory": "5b5f78dc86f77409407a7f8e" };
  let counter = 0;

  for (let trader in db.traders) {
    if (trader === "ragfair" || trader === "579dc571d53a0658a154fbec") {
      continue;
    }
    const allAssort = global._database.traders[trader].assort;////fileIO.readParsed("./user/cache/assort_" + trader + ".json");
    //allAssort = allAssort.data;

    for (let itemAssort of allAssort.items) {
      if (itemAssort.slotId === "hideout") {
        let barter_scheme = null;
        let loyal_level = 0;

        let itemsToSell = [];
        itemsToSell.push(itemAssort);
        itemsToSell = [...itemsToSell, ...findChildren(itemAssort._id, allAssort.items)];

        for (let barterFromAssort in allAssort.barter_scheme) {
          if (itemAssort._id == barterFromAssort) {
            barter_scheme = allAssort.barter_scheme[barterFromAssort][0];
            break;
          }
        }

        for (let loyal_levelFromAssort in allAssort.loyal_level_items) {
          if (itemAssort._id == loyal_levelFromAssort) {
            loyal_level = allAssort.loyal_level_items[loyal_levelFromAssort];
            break;
          }
        }

        response.offers.push(loadCache(OfferBase, itemsToSell, barter_scheme, loyal_level, trader, counter));
        counter += 1;
      }
    }
  }
  logger.logDebug(`[Ragfair Cache] Generated ${counter} offers inluding all traders assort`)
  //fileIO.write("user/cache/ragfair_offers.json", response, true, false);
  _database.ragfair_offers = response;
}


exports.load = () => {
  logger.logDebug("Load: 'Core'");
  _load_CoreData();
  logger.logDebug("Load: 'Globals'");
  _load_Globals();
  logger.logDebug("Load: 'Cluster Config'")
  _load_ClusterConfig();
  logger.logDebug("Load: 'Blacklist'")
  _load_BlacklistConfig();
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
  logger.logDebug("Load: 'Flea Market'");
  GenerateRagfairOffersCache();
  logger.logDebug("Load: 'Weather'");
  _load_WeatherData();
  logger.logInfo("Database loaded");
};
