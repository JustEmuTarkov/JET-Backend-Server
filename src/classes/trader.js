"use strict";

// used only in this file
function iter_item_children(item, item_list) {
  // Iterates through children of `item` present in `item_list`
  return item_list.filter((child_item) => child_item.parentId === item._id);
}
function iter_item_children_recursively(item, item_list) {
  // Recursively iterates through children of `item` present in `item_list`

  let stack = iter_item_children(item, item_list);
  let child_items = [...stack];

  while (stack.length > 0) {
    let child = stack.pop();
    let children_of_child = iter_item_children(child, item_list);
    stack.push(...children_of_child);
    child_items.push(...children_of_child);
  }

  return child_items;
}
function generate_item_ids(...items) {
  const ids_map = {};

  for (const item of items) {
    ids_map[item._id] = utility.generateNewItemId();
  }

  for (const item of items) {
    item._id = ids_map[item._id];
    if (item.parentId in ids_map) {
      item.parentId = ids_map[item.parentId];
    }
  }
}
function generateFenceAssort() {
  const fenceId = "579dc571d53a0658a154fbec";
  let base = { items: [], barter_scheme: {}, loyal_level_items: {} };

  let fence_base_assort = fileIO.readParsed(db.user.cache.assort_579dc571d53a0658a154fbec).data.items;

  let fence_base_assort_root_items = fence_base_assort.filter((item) => item.parentId === "hideout");

  const fence_assort = [];
  const barter_scheme = {};

  const FENCE_ASSORT_SIZE = global._database.gameplayConfig.trading.fenceAssortSize;
  for (let i = 0; i < FENCE_ASSORT_SIZE; i++) {
    let random_item_index = utility.getRandomInt(0, fence_base_assort_root_items.length - 1);
    let random_item = fence_base_assort_root_items[random_item_index];
    let random_item_children = iter_item_children_recursively(random_item, fence_base_assort);

    generate_item_ids(random_item, ...random_item_children);
    if (fence_assort.some((el) => el._id === random_item._id)) {
      continue;
    } // Prevent duplicate item IDs.
    fence_assort.push(random_item, ...random_item_children);

    let item_price = helper_f.getTemplatePrice(random_item._tpl);
    for (const child_item of random_item_children) {
      item_price += helper_f.getTemplatePrice(child_item._tpl);
    }

    barter_scheme[random_item._id] = [
      [
        {
          count: Math.round(item_price),
          _tpl: "5449016a4bdc2d6f028b456f", // Rubles template
        },
      ],
    ];
  }

  base.items = fence_assort;
  base.barter_scheme = barter_scheme;
  global._database.traders[fenceId].assort = base;
}
// Deep clone (except for the actual items) from base assorts.
function copyFromBaseAssorts(baseAssorts) {
  let newAssorts = {};
  newAssorts.items = [];
  for (let item of baseAssorts.items) {
    newAssorts.items.push(item);
  }
  newAssorts.barter_scheme = {};
  for (let barterScheme in baseAssorts.barter_scheme) {
    newAssorts.barter_scheme[barterScheme] = baseAssorts.barter_scheme[barterScheme];
  }
  newAssorts.loyal_level_items = {};
  for (let loyalLevelItem in baseAssorts.loyal_level_items) {
    newAssorts.loyal_level_items[loyalLevelItem] = baseAssorts.loyal_level_items[loyalLevelItem];
  }
  return newAssorts;
}
// delete assort keys
function removeItemFromAssort(assort, itemID) {
  let ids_toremove = helper_f.findAndReturnChildrenByItems(assort.items, itemID);

  delete assort.barter_scheme[itemID];
  delete assort.loyal_level_items[itemID];

  for (let i in ids_toremove) {
    for (let a in assort.items) {
      if (assort.items[a]._id === ids_toremove[i]) {
        assort.items.splice(a, 1);
      }
    }
  }

  return assort;
}
/*
check if an item is allowed to be sold to a trader
input : array of allowed categories, itemTpl of inventory
output : boolean
*/
function traderFilter(traderFilters, tplToCheck) {
  for (let filter of traderFilters) {
    for (let iaaaaa of helper_f.templatesWithParent(filter)) {
      if (iaaaaa == tplToCheck) {
        return true;
      }
    }

    for (let subcateg of helper_f.childrenCategories(filter)) {
      for (let itemFromSubcateg of helper_f.templatesWithParent(subcateg)) {
        if (itemFromSubcateg === tplToCheck) {
          return true;
        }
      }
    }
  }

  return false;
}
/* TraderServer class maintains list of traders for each sessionID in memory. */
class TraderServer {
  constructor() {
    this.fence_generated_at = 0;
  }
  getTrader(traderID, sessionID) {
    return global._database.traders[traderID].base;
  }
  saveTrader(traderId) {
    let inputNodes = fileIO.readParsed(db.traders[traderId].assort);
    let base = {
      err: 0,
      errmsg: null,
      data: { items: [], barter_scheme: {}, loyal_level_items: {} },
    };
    for (let item in inputNodes) {
      if (typeof inputNodes[item].items[0] != "undefined") {
        let ItemsList = inputNodes[item].items;
        ItemsList[0]["upd"] = {};
        if (inputNodes[item].default.unlimited) ItemsList[0].upd["UnlimitedCount"] = true;
        ItemsList[0].upd["StackObjectsCount"] = inputNodes[item].default.stack;
      }
      for (let assort_item in inputNodes[item].items) {
        base.data.items.push(inputNodes[item].items[assort_item]);
      }
      base.data.barter_scheme[item] = inputNodes[item].barter_scheme;
      base.data.loyal_level_items[item] = inputNodes[item].loyality;
    }

    fileIO.write(`./user/cache/assort_${traderId}.json`, base, true, false);
  }
  setTraderBase(base) {
    global._database.traders[base._id].base = base;
    if (typeof db.traders[base._id] != "undefined") fileIO.write(db.traders[base._id].base, base, true, false);
  }
  getAllTraders(sessionID, keepalive = false) {
    //if (!keepalive) keepalive_f.updateTraders(sessionID);
    let Traders = [];
    for (const traderID in global._database.traders) {
      if (traderID === "ragfair") {
        continue;
      }
      Traders.push(global._database.traders[traderID].base);
    }
    return Traders;
  }
  resetTrader(sessionID, traderID) {
    logger.logInfo(`Resetting ${traderID}`);
    let account = account_f.handler.find(sessionID);
    let pmcData = profile_f.handler.getPmcProfile(sessionID);
    let traderWipe = fileIO.readParsed(db.profile[account.edition]["initialTraderStanding"]);

    if (pmcData.TradersInfo[traderID] == undefined)
      pmcData.TradersInfo[traderID] = {
        salesSum: 0,
        standing: 0,
        unlocked: global._database.traders[traderID].base.unlockedByDefault,
      };

    if (traderID == "5c0647fdd443bc2504c2d371") pmcData.TradersInfo[traderID].unlocked = false;

    pmcData.TradersInfo[traderID].salesSum = traderWipe.initialSalesSum;
    pmcData.TradersInfo[traderID].standing = traderWipe.initialStanding;
  }
  getAssort(sessionID, traderID, isBuyingFromFence = false) {
    if (traderID === "579dc571d53a0658a154fbec" && !isBuyingFromFence) {
      // Fence
      // Lifetime in seconds
      let fence_assort_lifetime = global._database.gameplayConfig.trading.traderSupply[traderID];

      // Current time in seconds
      let current_time = Math.floor(new Date().getTime() / 1000);

      // Initial Fence generation pass.
      if (this.fence_generated_at === 0 || !this.fence_generated_at) {
        this.fence_generated_at = current_time;
        generateFenceAssort();
      }

      if (this.fence_generated_at + fence_assort_lifetime < current_time) {
        this.fence_generated_at = current_time;
        logger.logInfo("We are regenerating Fence's assort.");
        generateFenceAssort();
      }
    }
    // if (!(traderid in this.assorts)) {
    // // for modders generate endgame items for fence where you need to exchange it for that items
    // let tmp = fileio.readparsed(db.user.cache["assort_" + traderid]);
    // global._database.traders[traderid].assort = tmp.data;
    // }

    let baseAssorts = global._database.traders[traderID].assort;

    // Build what we're going to return.
    let assorts = copyFromBaseAssorts(baseAssorts);

    if (traderID !== "ragfair") {
      let pmcData = profile_f.handler.getPmcProfile(sessionID);
      const ProfileSaleSum = typeof pmcData.TradersInfo[traderID] != "undefined" ? pmcData.TradersInfo[traderID].salesSum : 0;
      const ProfileStanding = typeof pmcData.TradersInfo[traderID] != "undefined" ? pmcData.TradersInfo[traderID].standing : 0;
      const ProfileLevel = pmcData.Info.Level;
      let calcLevel = 0;
      for (const loyalityObject of global._database.traders[traderID].base.loyaltyLevels) {
        if (ProfileLevel >= loyalityObject.minLevel && ProfileStanding >= loyalityObject.minStanding && ProfileSaleSum >= loyalityObject.minSalesSum) {
          calcLevel++;
        }
      }
      if (calcLevel == 0) calcLevel = 1;
      const TraderLevel = calcLevel;

      // 1 is min level, 4 is max level
      let questassort = { started: {}, success: {}, fail: {} };
      if (typeof db.traders[traderID] != "undefined") {
        if (typeof db.traders[traderID].questassort == "undefined") {
          questassort = { started: {}, success: {}, fail: {} };
        } else if (fileIO.exist(db.traders[traderID].questassort)) {
          questassort = fileIO.readParsed(db.traders[traderID].questassort);
        }
      }

      for (let key in baseAssorts.loyal_level_items) {
        let requiredLevel = baseAssorts.loyal_level_items[key];
        if (requiredLevel > TraderLevel) {
          assorts = removeItemFromAssort(assorts, key);
          continue;
        }

        if (key in questassort.started && quest_f.getQuestStatus(pmcData, questassort.started[key]) !== "Started") {
          assorts = removeItemFromAssort(assorts, key);
          continue;
        }

        if (key in questassort.success && quest_f.getQuestStatus(pmcData, questassort.success[key]) !== "Success") {
          assorts = removeItemFromAssort(assorts, key);
          continue;
        }

        if (key in questassort.fail && quest_f.getQuestStatus(pmcData, questassort.fail[key]) !== "Fail") {
          assorts = removeItemFromAssort(assorts, key);
        }
      }
    } else {
    }
    return assorts;
  }
  getCustomization(traderID, sessionID) {
    let pmcData = profile_f.handler.getPmcProfile(sessionID);
    let allSuits = customization_f.getCustomization();
    let suitArray = fileIO.readParsed(db.traders[traderID].suits);
    let suitList = [];

    for (let suit of suitArray) {
      if (suit.suiteId in allSuits) {
        for (var i = 0; i < allSuits[suit.suiteId]._props.Side.length; i++) {
          let side = allSuits[suit.suiteId]._props.Side[i];

          if (side === pmcData.Info.Side) {
            suitList.push(suit);
          }
        }
      }
    }

    return suitList;
  }
  getAllCustomization(sessionID) {
    let output = [];

    for (let traderID in global._database.traders) {
      if (db.traders[traderID].suits !== undefined) {
        output = output.concat(this.getCustomization(traderID, sessionID));
      }
    }

    return output;
  }
  getPurchasesData(traderID, sessionID) {
    let pmcData = profile_f.handler.getPmcProfile(sessionID);
    let trader = global._database.traders[traderID].base;
    //const traderCategories = global._database.traders[traderID].categories;
    let currency = helper_f.getCurrency(trader.currency);
    let output = {};

    // get sellable items
    for (let item of pmcData.Inventory.items) {
      let price = 0;

      if (
        item._id === pmcData.Inventory.equipment ||
        item._id === pmcData.Inventory.stash ||
        item._id === pmcData.Inventory.questRaidItems ||
        item._id === pmcData.Inventory.questStashItems ||
        helper_f.isNotSellable(item._tpl) ||
        (trader.sell_category.length > 0 && traderFilter(trader.sell_category, item._tpl) === false)
      ) {
        continue;
      }

      // find all child of the item (including itself) and sum the price
      for (let childItem of helper_f.findAndReturnChildrenAsItems(pmcData.Inventory.items, item._id)) {
        if (!global._database.items[childItem._tpl]) {
          continue;
        } // Ignore child item if it does not have an entry in the db. -- kiobu
        let tempPrice = global._database.items[childItem._tpl]._props.CreditsPrice >= 1 ? global._database.items[childItem._tpl]._props.CreditsPrice : 1;
        let count = "upd" in childItem && "StackObjectsCount" in childItem.upd ? childItem.upd.StackObjectsCount : 1;
        price = price + tempPrice * count;
      }

      // dogtag calculation
      if ("upd" in item && "Dogtag" in item.upd && helper_f.isDogtag(item._tpl)) {
        price *= item.upd.Dogtag.Level;
      }

      // meds calculation
      let hpresource = "upd" in item && "MedKit" in item.upd ? item.upd.MedKit.HpResource : 0;

      if (hpresource > 0) {
        let maxHp = helper_f.getItem(item._tpl)[1]._props.MaxHpResource;
        price *= hpresource / maxHp;
      }

      // weapons and armor calculation
      let repairable = "upd" in item && "Repairable" in item.upd ? item.upd.Repairable : 1;

      if (repairable !== 1) {
        price *= repairable.Durability / repairable.MaxDurability;
      }

      // get real price
      if (trader.discount > 0) {
        price -= (trader.discount / 100) * price;
      }
      price = helper_f.fromRUB(price, currency);
      price = price > 0 && price !== "NaN" ? price : 1;

      output[item._id] = [[{ _tpl: currency, count: price.toFixed(0) }]];
    }

    return output;
  }
}

module.exports.handler = new TraderServer();
