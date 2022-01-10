"use strict";

/**
 * Returns the entire template lookup table.
 * @private
 * @returns {object} All templates.
 */
function tplLookup() {
  if (tplLookup.lookup === undefined) {
    const lookup = {
      items: {
        byId: {},
        byParent: {},
      },
      categories: {
        byId: {},
        byParent: {},
      },
    };

    for (let x of global._database.templates.Items) {
      lookup.items.byId[x.Id] = x.Price;
      lookup.items.byParent[x.ParentId] || (lookup.items.byParent[x.ParentId] = []);
      lookup.items.byParent[x.ParentId].push(x.Id);
    }

    for (let x of global._database.templates.Categories) {
      lookup.categories.byId[x.Id] = x.ParentId ? x.ParentId : null;
      if (x.ParentId) {
        // root as no parent
        lookup.categories.byParent[x.ParentId] || (lookup.categories.byParent[x.ParentId] = []);
        lookup.categories.byParent[x.ParentId].push(x.Id);
      }
    }

    tplLookup.lookup = lookup;
  }

  return tplLookup.lookup;
}

/**
 * Returns the price of a template item given a template ID.
 * @param {string} x A template ID.
 * @returns {object} A singular template.
 */
function getTemplatePrice(x) {
  return x in tplLookup().items.byId ? tplLookup().items.byId[x] : 1;
}

/**
 * Returns all items in template with a given parent category.
 * @param {string} x A template category.
 * @returns {Array.<Object>} A list of templates.
 */
function templatesWithParent(x) {
  return x in tplLookup().items.byParent ? tplLookup().items.byParent[x] : [];
}

/**
 * Checks if a category exists in the lookup table.
 * @param {string} x A template category. 
 * @returns {boolean} 
 */
function isCategory(x) {
  return x in tplLookup().categories.byId;
}

/**
 * Returns all children categories of a given category.
 * @param {string} x A template category.
 * @returns {Array.<Object>} A list of categories.
 */
function childrenCategories(x) {
  return x in tplLookup().categories.byParent ? tplLookup().categories.byParent[x] : [];
}

/**
 * Returns the 2D inventory grid.
 * @param {object} pmcData 
 * @param {string} sessionID 
 * @returns {Array.<Array.<number>>}
 */
function recheckInventoryFreeSpace(pmcData, sessionID) {
  // recalculate stash taken place
  let PlayerStash = getPlayerStash(sessionID);
  let Stash2D = Array(PlayerStash[1])
    .fill(0)
    .map((x) => Array(PlayerStash[0]).fill(0));

  let inventoryItemHash = getInventoryItemHash(pmcData.Inventory.items);
  if (!inventoryItemHash.byParentId[pmcData.Inventory.stash]) inventoryItemHash.byParentId[pmcData.Inventory.stash] = [];
  for (let item of inventoryItemHash.byParentId[pmcData.Inventory.stash]) {
    if (!("location" in item)) {
      continue;
    }

    let tmpSize = helper_f.getSizeByInventoryItemHash(item._tpl, item._id, inventoryItemHash);
    let iW = tmpSize[0]; // x
    let iH = tmpSize[1]; // y
    let fH = item.location.r === 1 || item.location.r === "Vertical" || item.location.rotation === "Vertical" ? iW : iH;
    let fW = item.location.r === 1 || item.location.r === "Vertical" || item.location.rotation === "Vertical" ? iH : iW;
    let fillTo = item.location.x + fW;

    for (let y = 0; y < fH; y++) {
      // fixed filling out of bound
      //if (item.location.y + y >= PlayerStash[1] && fillTo >= PlayerStash[0])
      //{
      //    continue;
      //}

      try {
        Stash2D[item.location.y + y].fill(1, item.location.x, fillTo);
      } catch (e) {
        logger.log("[STASH]", `Out of bounds for item ${item._id} [${item._id}] with error message: ${e}`);
      }
    }
  }

  return Stash2D;
}

/**
 * Checks if a given template ID is a money item.
 * @param {string} tpl A template ID. 
 * @returns {boolean} 
 */
function isMoneyTpl(tpl) {
  const moneyTplArray = ["569668774bdc2da2298b4568", "5696686a4bdc2da3298b456a", "5449016a4bdc2d6f028b456f"];
  return moneyTplArray.findIndex((moneyTlp) => moneyTlp === tpl) > -1;
}

/* Gets currency TPL from TAG
 * input: currency(tag)
 * output: template ID
 * */

/**
 * Returns the currency ID from money enum.
 * @param {enum} currency Either "EUR", "USD", or "RUB".
 * @returns {string} The template ID.
 */
function getCurrency(currency) {
  switch (currency) {
    case "EUR":
      return "569668774bdc2da2298b4568";
    case "USD":
      return "5696686a4bdc2da3298b456a";
    default:
      return "5449016a4bdc2d6f028b456f"; // RUB set by default
  }
}

/**
 * Converts from either USD or EUR to RUB.
 * @param {number} value Value in initial currency.
 * @param {string} currency The currency ID that value is using.
 * @returns {number} The result in RUB.
 */
function inRUB(value, currency) {
  return Math.round(value * getTemplatePrice(currency));
}

/* Gets Ruble to Currency conversion Value
 * input: value, currency tpl
 * output: value after conversion
 * */

/**
 * Converts from RUB to either USD or RUB.
 * @param {number} value Value in RUB.
 * @param {string} currency Currency ID to convert to.
 * @returns {number} The result in the given currency.
 */
function fromRUB(value, currency) {
  return Math.round(value / getTemplatePrice(currency));
}

/* take money and insert items into return to server request
 * input:
 * output: boolean
 * */

/**
 * Takes money for a transaction and sets the response output.
 * @private
 * @param {*} pmcData 
 * @param {object} body The request body.
 * @param {string} sessionID 
 * @returns {boolean} Whether or not there is enough money to complete the transaction.
 */
function payMoney(pmcData, body, sessionID) {
  let output = item_f.handler.getOutput(sessionID);
  let trader = trader_f.handler.getTrader(body.tid, sessionID);
  let currencyTpl = getCurrency(trader.currency);

  // delete barter things(not a money) from inventory
  if (body.Action === "TradingConfirm") {
    for (let index in body.scheme_items) {
      let item = undefined;

      for (let element of pmcData.Inventory.items) {
        if (body.scheme_items[index].id === element._id) {
          item = element;
        }
      }

      if (item !== undefined) {
        if (!isMoneyTpl(item._tpl)) {
          output = move_f.removeItem(pmcData, item._id, sessionID);
          body.scheme_items[index].count = 0;
        } else {
          currencyTpl = item._tpl;
          break;
        }
      }
    }
  }

  // find all items with currency _tpl id
  const moneyItems = this.findMoney("tpl", pmcData, currencyTpl);

  // prepare a price for barter
  let barterPrice = 0;

  for (let item of body.scheme_items) {
    barterPrice += item.count;
  }

  // prepare the amount of money in the profile
  let amountMoney = 0;

  for (let item of moneyItems) {
    amountMoney += !item.hasOwnProperty("upd") ? 1 : item.upd.StackObjectsCount;
  }

  // if no money in inventory or amount is not enough we return false
  if (moneyItems.length <= 0 || amountMoney < barterPrice) {
    return false;
  }

  let leftToPay = barterPrice;

  for (let moneyItem of moneyItems) {
    let itemAmount = !moneyItem.hasOwnProperty("upd") ? 1 : moneyItem.upd.StackObjectsCount; // Handle occurence when there is a stack of 1.

    if (leftToPay >= itemAmount) {
      leftToPay -= itemAmount;
      output = move_f.removeItem(pmcData, moneyItem._id, sessionID);
    } else {
      if (!moneyItem.upd) {
        output = move_f.removeItem(pmcData, moneyItem._id, sessionID);
      } else {
        moneyItem.upd.StackObjectsCount -= leftToPay;
        if (typeof output.profileChanges[pmcData._id].items.change == "undefined") output.profileChanges[pmcData._id].items.change = [];
        output.profileChanges[pmcData._id].items.change.push(moneyItem);
      }
      leftToPay = 0;
    }

    if (leftToPay === 0) {
      break;
    }
  }
  if (typeof pmcData.TradersInfo[body.tid] == "undefined") {
    pmcData.TradersInfo[body.tid] = {
      salesSum: 0,
      standing: 0,
      unlocked: true,
    };
  }
  output.profileChanges[pmcData._id].traderRelations = pmcData.TradersInfo;
  // set current sale sum -- convert barterPrice itemTpl into RUB then convert RUB into trader currency
  pmcData.TradersInfo[body.tid].salesSum += fromRUB(inRUB(barterPrice, currencyTpl), getCurrency(trader.currency));

  // save changes
  logger.logInfo("Items taken. Status OK.");
  item_f.handler.setOutput(output);
  return true;
}

/* Find Barter items in the inventory
 * input: object of player data, string BarteredItem ID
 * output: array of Item from inventory
 * */

/**
 * Returns an array of acceptable items in the player's inventory that can be used in a purchase.
 * @param {"tpl"|string} by Whether we should search by template or item ID.
 * @param {object} pmcData 
 * @param {string} barter_itemID The currency ID or barter ID to search for. Should be a template ID if "tpl" was passed to `by` parameter.
 * @returns {array} A list of currency items or barter items in the player's inventory.
 */
function findMoney(by, pmcData, barter_itemID) {
  // find required items to take after buying (handles multiple items)
  const barterIDs = typeof barter_itemID === "string" ? [barter_itemID] : barter_itemID;
  let itemsArray = [];

  for (const barterID of barterIDs) {
    let mapResult = pmcData.Inventory.items.filter((item) => {
      return by === "tpl" ? item._tpl === barterID : item._id === barterID;
    });

    itemsArray = Object.assign(itemsArray, mapResult);
  }

  return itemsArray;
}

/**
 * Finds an item given an ID using a linear search algorithm.
 * @param {array} items An array of items.
 * @param {string} id The item ID to search for.
 * @returns {object|false} The item object or false if no item was found.
 */
function findItemById(items, id) {
  for (let item of items) {
    if (item._id === id) {
      return item;
    }
  }

  return false;
}

/**
 * Finds an item given an ID using a linear search algorithm in the player's inventory.
 * @param {object} pmcData 
 * @param {string} idToFind The item ID to search for. 
 * @returns {object|false} The item object or false if no item was found.
 */
function findInventoryItemById(pmcData, idToFind) {
  for (let item of pmcData.Inventory.items) {
    if (item._id == idToFind) {
      return item;
    }
  }
  return false;
}

/**
 * Recursively checks if an item is inside the stash, and has the stash item as a parent (s.t. `slotId == hideout` is true.).
 * @param {object} pmcData 
 * @param {object} item An item object..
 * @returns {boolean} Whether or not the item is inside the stash.
 */
function isItemInStash(pmcData, item) {
  let container = item;

  while ("parentId" in container) {
    if (container.parentId === pmcData.Inventory.stash && container.slotId === "hideout") {
      return true;
    }

    container = findItemById(pmcData.Inventory.items, container.parentId);

    if (!container) {
      break;
    }
  }

  return false;
}

/**
 * Calculate item stacks and return money to player after selling an item.
 * @private
 * @param {object} pmcData 
 * @param {number} amount Amount to return to player.
 * @param {unknown} body The request body.
 * @param {object} output The current response output.
 * @param {string} sessionID 
 * @returns {object} The response output object sent to the item handler.
 */
function getMoney(pmcData, amount, body, output, sessionID) {
  let trader = trader_f.handler.getTrader(body.tid, sessionID);
  let currency = getCurrency(trader.currency);
  let calcAmount = fromRUB(inRUB(amount, currency), currency);
  let maxStackSize = global._database.items[currency]._props.StackMaxSize;
  let skip = false;

  for (let item of pmcData.Inventory.items) {
    // item is not currency
    if (item._tpl !== currency) {
      continue;
    }

    // item is not in the stash
    if (!isItemInStash(pmcData, item)) {
      continue;
    }

    if (item.upd.StackObjectsCount < maxStackSize) {
      if (item.upd.StackObjectsCount + calcAmount > maxStackSize) {
        // calculate difference
        calcAmount -= maxStackSize - item.upd.StackObjectsCount;
        item.upd.StackObjectsCount = maxStackSize;
      } else {
        skip = true;
        item.upd.StackObjectsCount = item.upd.StackObjectsCount + calcAmount;
      }

      if (typeof output.profileChanges[pmcData._id].items.change == "undefined") output.profileChanges[pmcData._id].items.change = [];
      output.profileChanges[pmcData._id].items.change.push(item);

      if (skip) {
        break;
      }
      continue;
    }
  }

  if (!skip) {
    let StashFS_2D = recheckInventoryFreeSpace(pmcData, sessionID);

    // creating item
    let stashSize = getPlayerStash(sessionID);

    wholeLoop: for (let My = 0; My <= stashSize[1]; My++) {
      for (let Mx = 0; Mx <= stashSize[0]; Mx++) {
        if (StashFS_2D[My][Mx] !== 0) {
          continue;
        }

        let amount = calcAmount;
        if (amount > maxStackSize) {
          calcAmount -= maxStackSize;
          amount = maxStackSize;
        } else {
          calcAmount = 0;
        }

        let MoneyItem = {
          _id: utility.generateNewItemId(),
          _tpl: currency,
          parentId: pmcData.Inventory.stash,
          slotId: "hideout",
          location: { x: Mx, y: My, r: "Horizontal" },
          upd: { StackObjectsCount: amount },
        };

        pmcData.Inventory.items.push(MoneyItem);
        if (typeof output.profileChanges[pmcData._id].items.new == "undefined") output.profileChanges[pmcData._id].items.new = [];
        output.profileChanges[pmcData._id].items.new.push(MoneyItem);

        if (calcAmount <= 0) {
          break wholeLoop;
        }
      }
    }
  }

  // set current sale sum
  if (typeof pmcData.TradersInfo[body.tid] == "undefined") {
    pmcData.TradersInfo[body.tid] = {
      salesSum: 0,
      standing: 0,
      unlocked: true,
    };
  }
  pmcData.TradersInfo[body.tid].salesSum += amount;
  output.profileChanges[pmcData._id].traderRelations = pmcData.TradersInfo;

  return output;
}

/**
 * Return the player's proper stash size.
 * @param {string} sessionID 
 * @returns {Array.<number>} Stash size in (X, Y).
 */
function getPlayerStash(sessionID) {
  //this sets automaticly a stash size from items.json (its not added anywhere yet cause we still use base stash)
  let stashTPL = profile_f.getStashType(sessionID);
  let stashX = global._database.items[stashTPL]._props.Grids[0]._props.cellsH !== 0 ? global._database.items[stashTPL]._props.Grids[0]._props.cellsH : 10;
  let stashY = global._database.items[stashTPL]._props.Grids[0]._props.cellsV !== 0 ? global._database.items[stashTPL]._props.Grids[0]._props.cellsV : 66;
  return [stashX, stashY];
}

/**
 * Returns a template in the database given a template ID.
 * @param {string} template The template ID to search for.
 * @returns {Array.<boolean|object>} Whether the template object was found or not, and the template object.
 */
function getItem(template) {
  // -> Gets item from <input: _tpl>
  if (template in global._database.items) {
    return [true, global._database.items[template]];
  }

  return [false, {}];
}

/**
 * Returns the item hash for an item.
 * @param {object} InventoryItem The item object.
 * @returns {unknown} The item hash.
 */
function getInventoryItemHash(InventoryItem) {
  let inventoryItemHash = {
    byItemId: {},
    byParentId: {},
  };

  for (let i = 0; i < InventoryItem.length; i++) {
    let item = InventoryItem[i];
    inventoryItemHash.byItemId[item._id] = item;

    if (!("parentId" in item)) {
      continue;
    }
    if (!(item.parentId in inventoryItemHash.byParentId)) {
      inventoryItemHash.byParentId[item.parentId] = [];
    }
    inventoryItemHash.byParentId[item.parentId].push(item);
  }
  return inventoryItemHash;
}

/**
 * Prepares the item width and height and returns the size in a grid-based inventory.
 * @private
 * @param {string} itemtpl The item template ID.
 * @param {string} itemID The item ID in the stash.
 * @param {unknown} inventoryItemHash The item hash.
 * @returns {Array.<number>} The item size in (X, Y).
 */
module.exports.getSizeByInventoryItemHash = (itemtpl, itemID, inventoryItemHash) => {
  let toDo = [itemID];
  let tmpItem = getItem(itemtpl)[1];
  let rootItem = inventoryItemHash.byItemId[itemID];
  let FoldableWeapon = tmpItem._props.Foldable;
  let FoldedSlot = tmpItem._props.FoldedSlot;

  let SizeUp = 0,
    SizeDown = 0,
    SizeLeft = 0,
    SizeRight = 0;
  let ForcedUp = 0,
    ForcedDown = 0,
    ForcedLeft = 0,
    ForcedRight = 0;
  let outX = tmpItem._props.Width,
    outY = tmpItem._props.Height;
  let skipThisItems = ["5448e53e4bdc2d60728b4567", "566168634bdc2d144c8b456c", "5795f317245977243854e041"];
  let rootFolded = rootItem.upd && rootItem.upd.Foldable && rootItem.upd.Foldable.Folded === true;

  //The item itself is collapsible
  if (FoldableWeapon && (FoldedSlot === undefined || FoldedSlot === "") && rootFolded) {
    outX -= tmpItem._props.SizeReduceRight;
  }

  if (!skipThisItems.includes(tmpItem._parent)) {
    while (true) {
      if (toDo.length === 0) {
        break;
      }

      if (toDo[0] in inventoryItemHash.byParentId) {
        for (let item of inventoryItemHash.byParentId[toDo[0]]) {
          //Filtering child items outside of mod slots, such as those inside containers, without counting their ExtraSize attribute
          if (item.slotId.indexOf("mod_") < 0) {
            continue;
          }

          toDo.push(item._id);

          // If the barrel is folded the space in the barrel is not counted
          let itm = getItem(item._tpl)[1];
          let childFoldable = itm._props.Foldable;
          let childFolded = item.upd && item.upd.Foldable && item.upd.Foldable.Folded === true;

          if (FoldableWeapon && FoldedSlot === item.slotId && (rootFolded || childFolded)) {
            continue;
          } else if (childFoldable && rootFolded && childFolded) {
            continue;
          }

          // Calculating child ExtraSize
          if (itm._props.ExtraSizeForceAdd === true) {
            ForcedUp += itm._props.ExtraSizeUp;
            ForcedDown += itm._props.ExtraSizeDown;
            ForcedLeft += itm._props.ExtraSizeLeft;
            ForcedRight += itm._props.ExtraSizeRight;
          } else {
            SizeUp = SizeUp < itm._props.ExtraSizeUp ? itm._props.ExtraSizeUp : SizeUp;
            SizeDown = SizeDown < itm._props.ExtraSizeDown ? itm._props.ExtraSizeDown : SizeDown;
            SizeLeft = SizeLeft < itm._props.ExtraSizeLeft ? itm._props.ExtraSizeLeft : SizeLeft;
            SizeRight = SizeRight < itm._props.ExtraSizeRight ? itm._props.ExtraSizeRight : SizeRight;
          }
        }
      }

      toDo.splice(0, 1);
    }
  }

  return [outX + SizeLeft + SizeRight + ForcedLeft + ForcedRight, outY + SizeUp + SizeDown + ForcedUp + ForcedDown];
};

/**
 * Find and return the children IDs of a given item ID in the player's stash.
 * @param {object} pmcData 
 * @param {string} itemID The parent item ID.
 * @returns {Array.<string>} A list of children IDs. This also includes the parent ID.
 */
function findAndReturnChildren(pmcData, itemID) {
  return findAndReturnChildrenByItems(pmcData.Inventory.items, itemID);
}

/**
 * Find and return the children IDs of a given item ID in a given items object.
 * @param {object} items The object of items to search in.
 * @param {string} itemID The parent item ID.
 * @returns {Array.<string>} A list of children IDs. This also includes the parent ID.
 */
function findAndReturnChildrenByItems(items, itemID) {
  let list = [];

  for (let childitem of items) {
    if (childitem.parentId === itemID) {
      list.push.apply(list, findAndReturnChildrenByItems(items, childitem._id));
    }
  }

  list.push(itemID); // it's required
  return list;
}

/**
 * Find and return the children item objects of a given item ID in a given items object.
 * @param {object} items The object of items to search in.
 * @param {string} itemID The parent item ID.
 * @returns {Array.<object>} A list of children item objects. This also includes the parent item object.
 */
function findAndReturnChildrenAsItems(items, itemID) {
  let list = [];

  for (let childitem of items) {
    // Include itself.
    if (childitem._id === itemID) {
      list.push(childitem);
      continue;
    }

    if (childitem.parentId === itemID) {
      list.push.apply(list, findAndReturnChildrenAsItems(items, childitem._id));
    }
  }
  return list;
}

/**
 * Checks if an item ID is a dogtag.
 * @param {string} itemId An item ID.
 * @returns {boolean} Whether or not the item is a dogtag.
 */
function isDogtag(itemId) {
  return itemId === "59f32bb586f774757e1e8442" || itemId === "59f32c3b86f77472a31742f0";
}

/**
 * Checks if an item is globally sellable.
 * @param {string} itemid An item ID.
 * @returns {boolean} Whether or not the item is globally sellable.
 */
function isNotSellable(itemid) {
  return "544901bf4bdc2ddf018b456d" === itemid || "5449016a4bdc2d6f028b456f" === itemid || "569668774bdc2da2298b4568" === itemid || "5696686a4bdc2da3298b456a" === itemid;
}

/**
 * Returns the identifier for a child using `slotId`, `locationX` and `locationY`.
 * @param {object} item The item object
 * @returns {string} The identifier.
 */
function getChildId(item) {
  if (!("location" in item)) {
    return item.slotId;
  }
  return item.slotId + "," + item.location.x + "," + item.location.y;
}

/**
 * Recursively replaces the IDs of a given items object with UUIDs if they collide with the player stash.
 * @param {object} pmcData 
 * @param {object} items The items object to check for duplicates.
 * @param {boolean} fastPanel
 * @returns {object} The items object with regenerated IDs.
 */
function replaceIDs(pmcData, items, fastPanel = null) {
  // replace bsg shit long ID with proper one
  let string_inventory = fileIO.stringify(items);

  for (let item of items) {
    let insuredItem = false;

    if (pmcData !== null) {
      // insured items shouldn't be renamed
      // only works for pmcs.
      for (let insurance of pmcData.InsuredItems) {
        if (insurance.itemId === item._id) {
          insuredItem = true;
        }
      }

      // do not replace important ID's
      if (item._id === pmcData.Inventory.equipment || item._id === pmcData.Inventory.questRaidItems || item._id === pmcData.Inventory.questStashItems || insuredItem) {
        continue;
      }
    }

    // replace id
    let old_id = item._id;
    let new_id = utility.generateNewItemId();

    string_inventory = string_inventory.replace(new RegExp(old_id, "g"), new_id);
    // Also replace in quick slot if the old ID exists.
    if (fastPanel !== null) {
      for (let itemSlot in fastPanel) {
        if (fastPanel[itemSlot] === old_id) {
          fastPanel[itemSlot] = fastPanel[itemSlot].replace(new RegExp(old_id, "g"), new_id);
        }
      }
    }
  }

  items = JSON.parse(string_inventory);

  // fix duplicate id's
  let dupes = {};
  let newParents = {};
  let childrenMapping = {};
  let oldToNewIds = {};

  // Finding duplicate IDs involves scanning the item three times.
  // First scan - Check which ids are duplicated.
  // Second scan - Map parents to items.
  // Third scan - Resolve IDs.
  for (let item of items) {
    dupes[item._id] = (dupes[item._id] || 0) + 1;
  }

  for (let item of items) {
    // register the parents
    if (dupes[item._id] > 1) {
      let newId = utility.generateNewItemId();

      newParents[item.parentId] = newParents[item.parentId] || [];
      newParents[item.parentId].push(item);
      oldToNewIds[item._id] = oldToNewIds[item._id] || [];
      oldToNewIds[item._id].push(newId);
    }
  }

  for (let item of items) {
    if (dupes[item._id] > 1) {
      let oldId = item._id;
      let newId = oldToNewIds[oldId].splice(0, 1)[0];
      item._id = newId;

      // Extract one of the children that's also duplicated.
      if (oldId in newParents && newParents[oldId].length > 0) {
        childrenMapping[newId] = {};
        for (let childIndex in newParents[oldId]) {
          // Make sure we haven't already assigned another duplicate child of
          // same slot and location to this parent.
          let childId = getChildId(newParents[oldId][childIndex]);
          if (!(childId in childrenMapping[newId])) {
            childrenMapping[newId][childId] = 1;
            newParents[oldId][childIndex].parentId = newId;
            newParents[oldId].splice(childIndex, 1);
          }
        }
      }
    }
  }
  return items;
}

/**
 * Splits an item stack if it exceeds the max stack size.
 * @param {object} item The item object.
 * @returns {Array.<object>} An array of item stacks.
 */
function splitStack(item) {
  if (!("upd" in item) || !("StackObjectsCount" in item.upd)) {
    return [item];
  }

  let maxStack = global._database.items[item._tpl]._props.StackMaxSize;
  let count = item.upd.StackObjectsCount;
  let stacks = [];

  while (count) {
    let amount = Math.min(count, maxStack);
    let newStack = clone(item);

    newStack.upd.StackObjectsCount = amount;
    count -= amount;
    stacks.push(newStack);
  }

  return stacks;
}

/**
 * Deep-clones an object. Do not use if the object value is a function.
 * @param {object} x An object.
 * @returns {object} A deep-clone of the object.
 */
function clone(x) {
  return fileIO.parse(fileIO.stringify(x));
}

/**
 * Set intersects two arrays.
 * @param {array} a 
 * @param {array} b 
 * @returns {array} The intersection of `a` and `b`.
 */
function arrayIntersect(a, b) {
  return a.filter((x) => b.includes(x));
}

// Searching for first item template ID and for preset ID

/**
 * Returns the preset for an item.
 * @param {string} id An item ID.
 * @returns {object|null} The preset object or `null` if no preset was found.
 */
function getPreset(id) {
  let itmPreset = global._database.globals.ItemPresets[id];
  if (typeof itmPreset == "undefined") {
    /* this was causing an error where preset id couldnt be found on the client and caused client stop loading map...
		for(let itemP in global._database.globals.ItemPresets){
			if(global._database.globals.ItemPresets[itemP]._items[0]._tpl == id){
				itmPreset = global._database.globals.ItemPresets[itemP];
				break;
			}
		}*/
    if (typeof itmPreset == "undefined") {
      logger.logWarning("Preset of id: " + id + " not found on a list (this warning is not important)");
      return null;
    }
  }
  return itmPreset;
}

/**
 * [undocumented]
 * @param {*} containerW 
 * @param {*} containerH 
 * @param {*} itemList 
 * @param {*} containerId 
 * @returns {unknown}
 */
module.exports.getContainerMap = (containerW, containerH, itemList, containerId) => {
  const container2D = Array(containerH)
    .fill(0)
    .map(() => Array(containerW).fill(0));
  const inventoryItemHash = helper_f.getInventoryItemHash(itemList);

  const containerItemHash = inventoryItemHash.byParentId[containerId];
  if (!containerItemHash) {
    // No items in the container
    return container2D;
  }

  for (const item of containerItemHash) {
    if (!("location" in item)) {
      continue;
    }

    const tmpSize = helper_f.getSizeByInventoryItemHash(item._tpl, item._id, inventoryItemHash);
    const iW = tmpSize[0]; // x
    const iH = tmpSize[1]; // y
    const fH = item.location.r === 1 || item.location.r === "Vertical" || item.location.rotation === "Vertical" ? iW : iH;
    const fW = item.location.r === 1 || item.location.r === "Vertical" || item.location.rotation === "Vertical" ? iH : iW;
    const fillTo = item.location.x + fW;

    for (let y = 0; y < fH; y++) {
      try {
        container2D[item.location.y + y].fill(1, item.location.x, fillTo);
      } catch (e) {
        logger.logError(`[OOB] for item with id ${item._id}; Error message: ${e}`);
      }
    }
  }

  return container2D;
};
// TODO: REWORK EVERYTHING ABOVE ~Maoci

/**
 * [undocumented]
 * @param {*} container2D 
 * @param {*} x 
 * @param {*} y 
 * @param {*} itemW 
 * @param {*} itemH 
 * @param {*} rotate 
 * @returns {unknown}
 */
module.exports.fillContainerMapWithItem = (container2D, x, y, itemW, itemH, rotate) => {
  let itemWidth = rotate ? itemH : itemW;
  let itemHeight = rotate ? itemW : itemH;

  for (let tmpY = y; tmpY < y + itemHeight; tmpY++) {
    for (let tmpX = x; tmpX < x + itemWidth; tmpX++) {
      if (container2D[tmpY][tmpX] === 0) {
        container2D[tmpY][tmpX] = 1;
      } else {
        logger.throwErr(`Slot at (${x}, ${y}) is already filled`, "src/classes/helper.js 734");
      }
    }
  }
  return container2D;
};

/**
 * Finds and returns an empty slot for an item if one is found in a container.
 * @param {unknown} container2D The 2D container object to search in.
 * @param {number} itemWidth The width of the item.
 * @param {number} itemHeight The height of the item.
 * @returns {object} The result object with a slot if one was found.
 */
module.exports.findSlotForItem = (container2D, itemWidth, itemHeight) => {
  let rotation = false;
  let minVolume = (itemWidth < itemHeight ? itemWidth : itemHeight) - 1;
  let containerY = container2D.length;
  let containerX = container2D[0].length;
  let limitY = containerY - minVolume;
  let limitX = containerX - minVolume;

  let locateSlot = (x, y, itemW, itemH) => {
    let foundSlot = true;
    for (let itemY = 0; itemY < itemH; itemY++) {
      if (foundSlot && y + itemH > containerY) {
        foundSlot = false;
        break;
      }

      for (let itemX = 0; itemX < itemW; itemX++) {
        if (foundSlot && x + itemW > containerX) {
          foundSlot = false;
          break;
        }

        if (container2D[y + itemY][x + itemX] !== 0) {
          foundSlot = false;
          break;
        }
      }

      if (!foundSlot) break;
    }
    return foundSlot;
  };

  for (let y = 0; y < limitY; y++) {
    for (let x = 0; x < limitX; x++) {
      let foundSlot = locateSlot(x, y, itemWidth, itemHeight);

      /**Try to rotate if there is enough room for the item
       * Only occupies one grid of items, no rotation required
       * */
      if (!foundSlot && itemWidth * itemHeight > 1) {
        foundSlot = locateSlot(x, y, itemHeight, itemWidth);

        if (foundSlot) rotation = true;
      }

      if (!foundSlot) continue;

      return { success: true, x, y, rotation };
    }
  }

  return { success: false, x: null, y: null, rotation: false };
};

/**
 * Appends an error to the output object and returns the object.
 * @param {object} output The output object.
 * @param {string} message The error message to append.
 * @param {string} title The error title to append.
 * @returns {object} The output object.
 */
module.exports.appendErrorToOutput = (output, message = "An unknown error occurred", title = "Error") => {
  output.warnings = [
    {
      index: 0,
      err: title,
      errmsg: message,
    },
  ];

  return output;
};

/**
 * [undocumented]
 * Prepares item width and height returns 2D size.
 * @param {string} itemtpl The template ID.
 * @param {string} itemID The item ID.
 * @param {object} InventoryItem The item object.
 * @returns {unknown}
 */
module.exports.getItemSize = (itemtpl, itemID, InventoryItem) => {
  // -> Prepares item Width and height returns [sizeX, sizeY]
  return helper_f.getSizeByInventoryItemHash(itemtpl, itemID, this.getInventoryItemHash(InventoryItem));
};

/**
 * [duplicate function] Returns the item hash for an item.
 * @param {object} InventoryItem The item object.
 * @returns {unknown} The item hash.
 */
module.exports.getInventoryItemHash = (InventoryItem) => {
  let inventoryItemHash = {
    byItemId: {},
    byParentId: {},
  };

  for (let i = 0; i < InventoryItem.length; i++) {
    let item = InventoryItem[i];
    inventoryItemHash.byItemId[item._id] = item;

    if (!("parentId" in item)) {
      continue;
    }

    if (!(item.parentId in inventoryItemHash.byParentId)) {
      inventoryItemHash.byParentId[item.parentId] = [];
    }
    inventoryItemHash.byParentId[item.parentId].push(item);
  }
  return inventoryItemHash;
};

/**
 * Returns the 2D stash map for a player's inventory.
 * @param {string} sessionID 
 * @param {object} pmcData 
 * @returns {unknown} The stash map.
 */
module.exports.getPlayerStashSlotMap = (sessionID, pmcData) => {
  // recalculate stach taken place
  let PlayerStashSize = getPlayerStash(sessionID);
  let Stash2D = Array(PlayerStashSize[1])
    .fill(0)
    .map((x) => Array(PlayerStashSize[0]).fill(0));

  let inventoryItemHash = helper_f.getInventoryItemHash(pmcData.Inventory.items);

  for (let item of inventoryItemHash.byParentId[pmcData.Inventory.stash]) {
    if (!("location" in item)) {
      continue;
    }

    let tmpSize = helper_f.getSizeByInventoryItemHash(item._tpl, item._id, inventoryItemHash);
    let iW = tmpSize[0]; // x
    let iH = tmpSize[1]; // y
    let fH = item.location.r === 1 || item.location.r === "Vertical" || item.location.rotation === "Vertical" ? iW : iH;
    let fW = item.location.r === 1 || item.location.r === "Vertical" || item.location.rotation === "Vertical" ? iH : iW;
    let fillTo = item.location.x + fW;

    for (let y = 0; y < fH; y++) {
      try {
        Stash2D[item.location.y + y].fill(1, item.location.x, fillTo);
      } catch (e) {
        logger.logError(`[OOB] for item with id ${item._id}; Error message: ${e}`);
      }
    }
  }

  return Stash2D;
};
// note from 2027: there IS a thing i didn't explore and that is Merges With Children
// -> Prepares item Width and height returns [sizeX, sizeY]
// check if this new one works and remove this one if it does

/**
 * @deprecated
 */
module.exports.getSizeByInventoryItemHash_old = (itemtpl, itemID, inventoryItemHash) => {
  let toDo = [itemID];
  let tmpItem = helper_f.getItem(itemtpl)[1];

  // Prevent traders not working if an template ID does not fetch a real item. -- kiobu
  // Note: This may cause problems when attempting to place an item in the same/relative place as a broken template item.
  if (JSON.stringify(tmpItem) === "{}") {
    logger.logError(`Could not find item from the given template ID in profile: ${itemtpl}. You should remove this item from your profile.`);
    return []; // Return empty array to continue execution.
  }

  let rootItem = inventoryItemHash.byItemId[itemID];
  let FoldableWeapon = tmpItem._props.Foldable;
  let FoldedSlot = tmpItem._props.FoldedSlot;

  let SizeUp = 0;
  let SizeDown = 0;
  let SizeLeft = 0;
  let SizeRight = 0;

  let ForcedUp = 0;
  let ForcedDown = 0;
  let ForcedLeft = 0;
  let ForcedRight = 0;
  let outX = tmpItem._props.Width;
  let outY = tmpItem._props.Height;
  let skipThisItems = ["5448e53e4bdc2d60728b4567", "566168634bdc2d144c8b456c", "5795f317245977243854e041"];
  let rootFolded = rootItem.upd && rootItem.upd.Foldable && rootItem.upd.Foldable.Folded === true;

  //The item itself is collapsible
  if (FoldableWeapon && (FoldedSlot === undefined || FoldedSlot === "") && rootFolded) {
    outX -= tmpItem._props.SizeReduceRight;
  }

  if (!skipThisItems.includes(tmpItem._parent)) {
    while (toDo.length > 0) {
      if (toDo[0] in inventoryItemHash.byParentId) {
        for (let item of inventoryItemHash.byParentId[toDo[0]]) {
          //Filtering child items outside of mod slots, such as those inside containers, without counting their ExtraSize attribute
          if (item.slotId.indexOf("mod_") < 0) {
            continue;
          }

          toDo.push(item._id);

          // If the barrel is folded the space in the barrel is not counted
          let itm = helper_f.getItem(item._tpl)[1];
          let childFoldable = itm._props.Foldable;
          let childFolded = item.upd && item.upd.Foldable && item.upd.Foldable.Folded === true;

          if (FoldableWeapon && FoldedSlot === item.slotId && (rootFolded || childFolded)) {
            continue;
          } else if (childFoldable && rootFolded && childFolded) {
            continue;
          }

          // Calculating child ExtraSize
          if (itm._props.ExtraSizeForceAdd === true) {
            ForcedUp += itm._props.ExtraSizeUp;
            ForcedDown += itm._props.ExtraSizeDown;
            ForcedLeft += itm._props.ExtraSizeLeft;
            ForcedRight += itm._props.ExtraSizeRight;
          } else {
            SizeUp = SizeUp < itm._props.ExtraSizeUp ? itm._props.ExtraSizeUp : SizeUp;
            SizeDown = SizeDown < itm._props.ExtraSizeDown ? itm._props.ExtraSizeDown : SizeDown;
            SizeLeft = SizeLeft < itm._props.ExtraSizeLeft ? itm._props.ExtraSizeLeft : SizeLeft;
            SizeRight = SizeRight < itm._props.ExtraSizeRight ? itm._props.ExtraSizeRight : SizeRight;
          }
        }
      }

      toDo.splice(0, 1);
    }
  }

  return [outX + SizeLeft + SizeRight + ForcedLeft + ForcedRight, outY + SizeUp + SizeDown + ForcedUp + ForcedDown];
};

module.exports.getPreset = getPreset;
module.exports.getTemplatePrice = getTemplatePrice;
module.exports.templatesWithParent = templatesWithParent;
module.exports.isCategory = isCategory;
module.exports.childrenCategories = childrenCategories;
module.exports.recheckInventoryFreeSpace = recheckInventoryFreeSpace;
module.exports.isMoneyTpl = isMoneyTpl;
module.exports.getCurrency = getCurrency;
module.exports.inRUB = inRUB;
module.exports.fromRUB = fromRUB;
module.exports.payMoney = payMoney;
module.exports.findMoney = findMoney;
module.exports.getMoney = getMoney;
module.exports.getPlayerStash = getPlayerStash;
module.exports.getItem = getItem;
module.exports.findAndReturnChildren = findAndReturnChildren;
module.exports.findAndReturnChildrenByItems = findAndReturnChildrenByItems;
module.exports.findAndReturnChildrenAsItems = findAndReturnChildrenAsItems;
module.exports.isDogtag = isDogtag;
module.exports.isNotSellable = isNotSellable;
module.exports.replaceIDs = replaceIDs;
module.exports.splitStack = splitStack;
module.exports.clone = clone;
module.exports.arrayIntersect = arrayIntersect;
module.exports.findInventoryItemById = findInventoryItemById;
module.exports.getInventoryItemHash = getInventoryItemHash;
