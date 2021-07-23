"use strict";

const { logger } = require("../../core/util/logger");

function GetItemParents() {
  return [
    "5485a8684bdc2da71d8b4567",
    "543be5cb4bdc2deb348b4568",
    "5b3f15d486f77432d0509248",
    "5448e54d4bdc2dcc718b4568",
    "57bef4c42459772e8d35a53b",
    "5447b5fc4bdc2d87278b4567",
    "5447b5f14bdc2d61278b4567",
    "55818add4bdc2d5b648b456f",
    "5a74651486f7744e73386dd1",
    "5448e53e4bdc2d60728b4567",
    "555ef6e44bdc2de9068b457e",
    "5448eb774bdc2d0a728b4567",
    "57864ee62459775490116fc1",
    "55818afb4bdc2dde698b456d",
    "57864ada245977548638de91",
    "55818a6f4bdc2db9688b456b",
    "55818ad54bdc2ddc698b4569",
    "55818acf4bdc2dde698b456b",
    "5f4fbaaca5573a5ac31db429",
    "550aa4af4bdc2dd4348b456e",
    "566162e44bdc2d3f298b4573",
    "5448e8d64bdc2dce718b4568",
    "5448f3a14bdc2d27728b4569",
    "57864a66245977548f04a81f",
    "543be5f84bdc2dd4348b456a",
    "5a341c4686f77469e155819e",
    "550aa4bf4bdc2dd6348b456b",
    "55818b084bdc2d5b648b4571",
    "5448e8d04bdc2ddf718b4569",
    "543be6674bdc2df1348b4569",
    "55818af64bdc2d5b648b4570",
    "5d650c3e815116009f6201d2",
    "550aa4154bdc2dd8348b456b",
    "56ea9461d2720b67698b456f",
    "55802f3e4bdc2de7118b4584",
    "5447bedf4bdc2d87278b4568",
    "55818a104bdc2db9688b4569",
    "5645bcb74bdc2ded0b8b4578",
    "5a341c4086f77401f2541505",
    "57864c322459775490116fbf",
    "5448ecbe4bdc2d60728b4568",
    "55d720f24bdc2d88028b456d",
    "55818ac54bdc2d5b648b456e",
    "54009119af1c881c07000029",
    "57864a3d24597754843f8721",
    "543be5e94bdc2df1348b4568",
    "5c164d2286f774194c5e69fa",
    "5c99f98d86f7745c314214b3",
    "5447e1d04bdc2dff2f8b4567",
    "55818b014bdc2ddc698b456b",
    "55818b0e4bdc2dde698b456e",
    "5671435f4bdc2d96058b4569",
    "566965d44bdc2d814c8b4571",
    "57864e4c24597754843f8723",
    "5447bed64bdc2d97278b4568",
    "5448bc234bdc2d3c308b4569",
    "567849dd4bdc2d150f8b456e",
    "5447b6194bdc2d67278b4567",
    "55802f4a4bdc2ddb688b4569",
    "5448f3ac4bdc2dce718b4569",
    "57864c8c245977548867e7f1",
    "5448f39d4bdc2d0a728b4568",
    "543be5664bdc2dd4348b4569",
    "5448bf274bdc2dfc2f8b456a",
    "5448fe124bdc2da5018b4567",
    "543be5dd4bdc2deb348b4569",
    "55818b224bdc2dde698b456f",
    "5448fe394bdc2d0d028b456c",
    "550aa4dd4bdc2dc9348b4569",
    "5a2c3a9486f774688b05e574",
    "55818ae44bdc2dde698b456c",
    "590c745b86f7743cc433c5f2",
    "5447b5cf4bdc2d65278b4567",
    "55818a684bdc2ddd698b456d",
    "550ad14d4bdc2dd5348b456c",
    "557596e64bdc2dc2118b4571",
    "55818b1d4bdc2d5b648b4572",
    "55818a304bdc2db5418b457d",
    "566168634bdc2d144c8b456c",
    "55818a604bdc2db5418b457e",
    "5447b6094bdc2dc3278b4567",
    "5448fe7a4bdc2d6f028b456b",
    "550aa4cd4bdc2dd8348b456c",
    "5795f317245977243854e041",
    "5447b5e04bdc2d62278b4567",
    "5447b6254bdc2dc3278b4568",
    "55818aeb4bdc2ddc698b456a",
    "5447bee84bdc2dc3278b4569",
    "5447e0e74bdc2d3c308b4567",
    "5661632d4bdc2d903d8b456b",
    "566abbb64bdc2d144c8b457d",
    "567583764bdc2d98058b456e",
    "5448f3a64bdc2d60728b456a",
    "55818a594bdc2db9688b456a",
    "55818b164bdc2ddc698b456c",
    "5d21f59b6dbe99052b54ef83",
    "543be6564bdc2df4348b4568",
    "57864bb7245977548b3b66c2",
    "5448e5284bdc2dcb718b4567",
    "5448e5724bdc2ddf718b4568",
    "5422acb9af1c889c16000029",
  ];
}

/*
5cdeb229d7f00c000e7ce174 heavy machine gun
5d52cc5ba4b9367408500062 automatic grenade launcher
*/

function detectLootSpawn(lootData) {
  let containsSpawns = [];
  if (global._database.gameplayConfig.useDynamicLootFromItemsArray) {
    for (const spawnTemplate in lootData.Items) {
      const filteredData = Object.values(global._database.items).filter((itemTemplate) => itemTemplate._parent == spawnTemplate);
      // add them to the list
      if (filteredData.length != 0) {
        for (const itemTemplate in filteredData) {
          containsSpawns.push(filteredData[itemTemplate]._id);
        }
      } else {
        containsSpawns.push(spawnTemplate);
      }
    }
  } else {
    for (const key in global._database.locationConfigs.dynamicLootAutoSpawnDetector) {
      if (lootData.Id.includes(key)) {
        const parentsToAdd = global._database.locationConfigs.dynamicLootAutoSpawnDetector[key].split(",");
        for (const parent in parentsToAdd) {
          const filteredData = Object.values(global._database.items).filter((itemTemplate) => itemTemplate._parent == parentsToAdd[parent]);
          if (filteredData.length != 0) {
            for (const itemTemplate in filteredData) {
              containsSpawns.push(filteredData[itemTemplate]._id);
            }
          } else {
            containsSpawns.push(parentsToAdd[parent]);
          }
        }
      }
    }
  }
  return containsSpawns;
}

function LoadLootContainerNode() {
  return Object.values(global._database.items).filter((item) => item._parent === "566965d44bdc2d814c8b4571");
}
function GetLootContainerData(ItemID, LootContainerNode) {
  const LootContainerNodeList = Object.values(LootContainerNode).filter((node) => node._id == ItemID);
  if (LootContainerNodeList == 0) return null;
  return LootContainerNodeList[0];
}
function DeepParentToItemSearch(incomingList) {
  let itemList = [];
  for (const obj in incomingList) {
    const listOfItems = Object.values(_database.items).filter((item) => item._parent == incomingList[obj]._id);
    for (const itemTemplate in listOfItems) {
      if (typeof listOfItems[itemTemplate]._props.Rarity == "undefined") {
        let output = DeepParentToItemSearch([listOfItems[itemTemplate]]);
        for (const data in output) {
          itemList.push(output[data]);
        }
      } else {
        itemList.push(listOfItems[itemTemplate]);
      }
    }
  }
  return itemList;
}

function GenerateLootList(container) {
  let LootList = {};
  let SpawnFilter = container._props.SpawnFilter;
  //let ItemParents = GetItemParents();
  //let ParentsToAdd = [];
  //let LootTable = [];

  for (let sf_item of SpawnFilter) {
    const listOfItems = Object.values(_database.items).filter((item) => item._parent == sf_item);
    if (listOfItems.length == 0) {
      // its item
      const _item = _database.items[sf_item];
      if (typeof _item != "undefined") {
        LootList[sf_item] = _item;
        if (typeof _item._props.Chambers != "undefined") {
          LootList[sf_item]["preset"] = FindIfItemIsAPreset(sf_item);
        } else {
          LootList[sf_item]["preset"] = null;
        }
      }
    } else {
      // its parent
      for (const item in listOfItems) {
        if (typeof listOfItems[item]._props.Rarity == "undefined") {
          let itemsList = DeepParentToItemSearch([listOfItems[item]]);
          for (const item in itemsList) {
            LootList[itemsList[item]._id] = itemsList[item];
            if (typeof itemsList[item]._props.Chambers != "undefined") {
              LootList[itemsList[item]._id]["preset"] = FindIfItemIsAPreset(itemsList[item]._id);
            } else {
              LootList[itemsList[item]._id]["preset"] = null;
            }
          }
        } else {
          LootList[listOfItems[item]._id] = listOfItems[item];
          if (typeof listOfItems[item]._props.Chambers != "undefined") {
            LootList[listOfItems[item]._id]["preset"] = FindIfItemIsAPreset(listOfItems[item]._id);
          } else {
            LootList[listOfItems[item]._id]["preset"] = null;
          }
        }
      }
    }
  }
  // Shuffle LootList for added randomization
  LootList = Object.keys(LootList)
    .map((key) => ({ key, value: LootList[key] }))
    .sort((a, b) => b.key.localeCompare(a.key))
    .reduce((acc, e) => {
      acc[e.key] = e.value;
      return acc;
    }, {});
  return LootList;
}
function FindIfItemIsAPreset(ID_TO_SEARCH) {
  let foundPresetsList = Object.values(_database.globals.ItemPresets).filter((preset) => typeof preset._encyclopedia != "undefined" && preset._encyclopedia == ID_TO_SEARCH);
  if (foundPresetsList.length == 0) return null;
  return foundPresetsList[0];
}
function DeepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function GetRarityMultiplier(rarity) {
  switch (rarity) {
    case "Not_exist":
      return global._database.gameplayConfig.locationloot.containers.RarityMultipliers.Not_exist;
    case "Rare":
      return global._database.gameplayConfig.locationloot.containers.RarityMultipliers.Rare;
    case "Superrare":
      return global._database.gameplayConfig.locationloot.containers.RarityMultipliers.Superrare;
    default:
      return global._database.gameplayConfig.locationloot.containers.RarityMultipliers.Common;
  }
}

// LOOT CREATION START !!!!!
function _MountedLootPush(typeArray, output) {
  let count = 0;
  for (let i in typeArray) {
    let data = DeepCopy(typeArray[i]);

    let changedIds = {};
    for (var item of data.Items) {
      let newId = utility.generateNewItemId();
      changedIds[item._id] = newId;
      if (item._id == data.Root) data.Root = newId;
      item._id = newId;
      if (!item.parentId) continue;

      item.parentId = changedIds[item.parentId];
    }
    output.Loot.push(data);
    count++;
  }
  return count;
}
function _ForcedLootPush(typeArray, output) {
  let count = 0;
  for (let i in typeArray) {
    let data = DeepCopy(typeArray[i]);
    let newItemsData = [];
    // forced loot should be only contain 1 item... (there shouldnt be any weapon in there...)
    const newId = utility.generateNewItemId();

    let createEndLootData = {
      Id: data.Id,
      IsStatic: data.IsStatic,
      useGravity: data.useGravity,
      randomRotation: data.randomRotation,
      Position: data.Position,
      Rotation: data.Rotation,
      IsGroupPosition: data.IsGroupPosition,
      GroupPositions: data.GroupPositions,
      Root: newId,
      Items: [
        {
          _id: newId,
          _tpl: data.Items[0],
        },
      ],
    };

    output.Loot.push(createEndLootData);
    count++;
  }
  return count;
}
function _StaticsLootPush(typeArray, output) {
  // TODO: this needs redo ~themaoci
  let count = 0;
  //let dateNow = Date.now();
  for (let i in typeArray) {
    let data = typeArray[i];
    //if (data.Items.length > 1) data.Items.splice(1);
    //logger.logInfo(`Container ${data.Id}, TimeElapsed: ${Date.now() - dateNow}ms`); dateNow = Date.now();
    _GenerateContainerLoot(data.Items);
    //logger.logInfo(`Container - END - , TimeElapsed: ${Date.now() - dateNow}ms`); dateNow = Date.now();
    data.Root = data.Items[0]._id;
    output.Loot.push(data);
    count++;
  }
  return count;
}
function _DynamicLootPush(typeArray, output, locationLootChanceModifier) {
  let count = 0;
  for (let itemLoot in typeArray) {
    const lootData = typeArray[itemLoot];
    //loot overlap removed its useless...
    let detectedItemsToSpawn = detectLootSpawn(lootData); // add this function
    // should return Array() of strings where they are item ID's
    // check server settigns if auto detect or use Items strings to detect predefined items
    if (detectedItemsToSpawn.length == 0) {
      logger.logWarning(`LootSpawn: ${lootData.Id} has not found any loot table for the spawn automatically. Skipping...`);
      continue;
    }

    const generatedItemId = utility.generateNewItemId();
    let randomChoosedItem = detectedItemsToSpawn[utility.getRandomInt(0, detectedItemsToSpawn.length - 1)];

    const createdItem = {
      _id: generatedItemId,
      _tpl: randomChoosedItem,
    };

    // item creation
    let createEndLootData = {
      Id: lootData.Id,
      IsStatic: lootData.IsStatic,
      useGravity: lootData.useGravity,
      randomRotation: lootData.randomRotation,
      Position: lootData.Position,
      Rotation: lootData.Rotation,
      IsGroupPosition: lootData.IsGroupPosition,
      GroupPositions: lootData.GroupPositions,
      Root: generatedItemId,
      Items: [],
    };
    createEndLootData.Items.push(createdItem);
    // now add other things like cartriges etc.

    // AMMO BOXES !!!
    if (global._database.items[createEndLootData.Items[0]._tpl]._parent == "543be5cb4bdc2deb348b4568") {
      createEndLootData.Items.push({
        _id: utility.generateNewItemId(),
        _tpl: global._database.items[createEndLootData.Items[0]._tpl]._props.StackSlots[0]._props.filters[0].Filter[0],
        parentId: createEndLootData.Items[0]._id,
        slotId: "cartridges",
        location: 0,
        upd: {
          StackObjectsCount: utility.getRandomInt(
            global._database.items[createEndLootData.Items[0]._tpl]._props.StackMinRandom,
            global._database.items[createEndLootData.Items[0]._tpl]._props.StackMaxRandom
          ),
        },
      });
    }
    // Preset weapon
    const PresetData = FindIfItemIsAPreset(createEndLootData.Items[0]._tpl);
    if (PresetData != null) {
      let preset = utility.getRandomInt(0, PresetData.length);
      if (preset == null) continue;

      let oldBaseItem = preset._items[0];
      preset._items = preset._items.splice(0, 1);
      let idSuffix = 0;
      let OldIds = {};
      for (var p in preset._items) {
        let currentItem = DeepCopy(preset._items[p]);
        OldIds[currentItem.id] = utility.generateNewItemId();
        if (currentItem.parentId == oldBaseItem._id) currentItem.parentId = createEndLootData.Items[0]._id;
        if (typeof OldIds[currentItem.parentId] != "undefined") currentItem.parentId = OldIds[currentItem.parentId];

        currentItem.id = OldIds[currentItem.id];
        createEndLootData.Items.push(currentItem);

        if (preset._items[p].slotId === "mod_magazine") {
          let mag = helper_f.getItem(preset._items[p]._tpl)[1];
          let cartridges = {
            _id: currentItem.id + "_" + idSuffix,
            _tpl: item._props.defAmmo,
            parentId: preset._items[p]._id,
            slotId: "cartridges",
            upd: { StackObjectsCount: mag._props.Cartridges[0]._max_count },
          };

          createEndLootData.Items.push(cartridges);
          idSuffix++;
        }
      }
      /*
      {
				"_changeWeaponName": false,
				"_encyclopedia": "5644bd2b4bdc2d3b4c8b4572",
				"_id": "5841474424597759ba49be91",
				"_items": [
					{
						"_id": "59c68b1c86f77452a35a8017",
						"_tpl": "5644bd2b4bdc2d3b4c8b4572"
					}
				],
				"_name": "AK-74N",
				"_parent": "59c68b1c86f77452a35a8017",
				"_type": "Preset"
			}
      */
    }
    // spawn change calculation
    const num = utility.getRandomInt(0, 10000);
    const spawnChance = helper_f.getItem(createdItem._tpl)[1]["_props"]["SpawnChance"] * 100;

    const itemChance = spawnChance * locationLootChanceModifier;
    if (num >= itemChance) {
      //lootPositions.push(position);
      count++;
      output.Loot.push(createEndLootData);
    }
  }
  return count;
}
// LOOT CREATION END !!!!!

function _RollMaxItemsToSpawn(container) {
  let minCount = 0;
  const maxItemsPossibleToSpawn = container._props.Grids[0]._props.cellsV * container._props.Grids[0]._props.cellsH;

  if (utility.getRandomInt(0, 100) > _database.gameplayConfig.locationloot.containers.ChanceForEmpty) {
    minCount++;
    for (let i = 1; i < maxItemsPossibleToSpawn; i++) {
      if (utility.getRandomInt(0, 100) < _database.gameplayConfig.locationloot.containers.ChanceToSpawnNextItem) {
        minCount++;
      }
    }
  }
  return minCount;
}
function _GenerateContainerLoot(_items) {
  // themaoci: will need to review it again and shorten it !!!
  // we are getting the lootcontainer node and selecting proper loot container
  let LootContainerNode = LoadLootContainerNode();
  if (LootContainerNode == null) throw "LootContainerNode is null something goes wrong please check db.items[???LootContainer???.json] file";
  let container = Object.values(LootContainerNode).filter((container) => container._id == _items[0]._tpl);
  if (container.length == 0) {
    logger.logWarning("GetLootContainerData is null something goes wrong please check if container template: " + _items[0]._tpl + " exists");
    return;
  }

  container = container[0];
  const LootList = GenerateLootList(container);

  const parentId = _items[0]._id;
  const idPrefix = parentId.substring(0, parentId.length - 4);
  let idSuffix = parseInt(parentId.substring(parentId.length - 4), 16) + 1;
  let container2D = Array(container._props.Grids[0]._props.cellsV)
    .fill()
    .map(() => Array(container._props.Grids[0]._props.cellsH).fill(0));
  //let maxProbability = container.maxProbability;
  let addedPresets = [];

  const minCount = _RollMaxItemsToSpawn(container);

  let totalChance = 0;
  for (let item in LootList) {
    if (typeof LootList[item]._props.Rarity == "undefined")
      logger.logWarning(`LootList[item]._props.Rarity == "undefined" for ${LootList[item]._id} in location>_GenerateContainerLoot`);
    if (LootList[item]._props.SpawnChance) totalChance += LootList[item]._props.SpawnChance * GetRarityMultiplier(LootList[item]._props.Rarity);
  }

  let itemWidth = 0;
  let itemHeight = 0;
  for (let i = 0; i < minCount; i++) {
    let item = {};
    let containerItem = {};
    let result = { success: false };
    let maxAttempts = _database.gameplayConfig.locationloot.containers.AttemptsToPlaceLoot;

    while (!result.success && maxAttempts) {
      let currentTotal = 0;
      let roll = Math.random() * totalChance;
      //let rolling_pool = [];
      let rolled = null;
      for (let lootItem in LootList) {
        currentTotal += LootList[lootItem]._props.SpawnChance * GetRarityMultiplier(LootList[lootItem]._props.Rarity);
        if (currentTotal >= roll) {
          rolled = LootList[lootItem];
          break;
        }
      }
      if (rolled != null) {
        item = helper_f.getItem(rolled._id)[1];
        itemWidth = item._props.Width;
        itemHeight = item._props.Height;

        if (rolled.preset != null) {
          // Prevent the same preset from spawning twice (it makes the client mad)
          if (addedPresets.includes(rolled.preset._id)) {
            i--;
            continue;
          }
          addedPresets.push(rolled.preset._id);
          let size = helper_f.getItemSize(item._id, rolled.preset._items[0]._id, rolled.preset._items);
          // Guns will need to load a preset of items
          item._props.presetId = rolled.preset._id;
          itemWidth = size[0];
          itemHeight = size[1];
        }
        result = helper_f.findSlotForItem(container2D, itemWidth, itemHeight);
      }
      maxAttempts--;
    }

    // if we weren't able to find an item to fit after 20 tries then container is probably full
    if (!result.success) break;

    container2D = helper_f.fillContainerMapWithItem(container2D, result.x, result.y, itemWidth, itemHeight, result.rotation);
    let rot = result.rotation ? 1 : 0;

    if (item._props.presetId) {
      // Process gun preset into container items
      let preset = helper_f.getPreset(item._props.presetId);
      if (preset == null) continue;
      preset._items[0].parentId = parentId;
      preset._items[0].slotId = "main";
      preset._items[0].location = { x: result.x, y: result.y, r: rot };

      for (var p in preset._items) {
        _items.push(DeepCopy(preset._items[p]));

        if (preset._items[p].slotId === "mod_magazine") {
          let mag = helper_f.getItem(preset._items[p]._tpl)[1];
          let cartridges = {
            _id: idPrefix + idSuffix.toString(16),
            _tpl: item._props.defAmmo,
            parentId: preset._items[p]._id,
            slotId: "cartridges",
            upd: { StackObjectsCount: mag._props.Cartridges[0]._max_count },
          };

          _items.push(cartridges);
          idSuffix++;
        }
      }

      continue;
    }

    containerItem = {
      _id: idPrefix + idSuffix.toString(16),
      _tpl: item._id,
      parentId: parentId,
      slotId: "main",
      location: { x: result.x, y: result.y, r: rot },
    };

    let cartridges;
    if (item._parent === "543be5dd4bdc2deb348b4569" || item._parent === "5485a8684bdc2da71d8b4567") {
      // Money or Ammo stack
      let stackCount = utility.getRandomInt(item._props.StackMinRandom, item._props.StackMaxRandom);
      containerItem.upd = { StackObjectsCount: stackCount };
    } else if (item._parent === "543be5cb4bdc2deb348b4568") {
      // Ammo container
      idSuffix++;

      cartridges = {
        _id: idPrefix + idSuffix.toString(16),
        _tpl: item._props.StackSlots[0]._props.filters[0].Filter[0],
        parentId: containerItem._id,
        slotId: "cartridges",
        upd: { StackObjectsCount: item._props.StackMaxRandom },
      };
    } else if (item._parent === "5448bc234bdc2d3c308b4569") {
      // Magazine
      idSuffix++;
      cartridges = {
        _id: idPrefix + idSuffix.toString(16),
        _tpl: item._props.Cartridges[0]._props.filters[0].Filter[0],
        parentId: parentId,
        slotId: "cartridges",
        upd: { StackObjectsCount: item._props.Cartridges[0]._max_count },
      };
    }

    _items.push(containerItem);

    if (cartridges) _items.push(cartridges);
    idSuffix++;
  }

  let changedIds = {};
  for (let item of _items) {
    let newId = utility.generateNewItemId();
    changedIds[item._id] = newId;
    item._id = newId;

    if (!item.parentId) continue;
    item.parentId = changedIds[item.parentId];
  }
}

/* LocationServer class maintains list of locations in memory. */
class LocationServer {
  /* generates a random location preset to use for local session */
  generate(name, sessionID) {
    let dateNow = Date.now();
    let stage = 0;
    // dont read next time ??
    if (typeof global._database.locations[name] == "undefined") {
      logger.logWarning("No Such Location");
      return;
    }
    let _location = global._database.locations[name];

    if (global._database.gameplayConfig.locationloot.useDynamicLootMultiplier) {
      if (sessionID != "" && typeof sessionID != "undefined") {
        let exfilData = profile_f.handler.getProfileExfilsById(sessionID);

        let sumExfils = 0;
        for (const key in exfilData) {
          sumExfils += exfilData[key];
        }
        if (sumExfils != 0) {
          _location.base.GlobalLootChanceModifier = sumExfils / (sumExfils + exfilData[name]);
        } else {
          _location.base.GlobalLootChanceModifier = 1;
        }
      }
    }

    let output = _location.base;
    let ids = {};

    // don't generate loot on hideout
    if (name === "hideout") {
      return output;
    }

    // Deep copy so the variable contents can be edited non-destructively
    let forced = DeepCopy(_location.loot.forced);
    let mounted = DeepCopy(_location.loot.mounted);
    let statics = DeepCopy(_location.loot.static);
    let dynamic = DeepCopy(_location.loot.dynamic);
    logger.logInfo(`State Prepare, TimeElapsed: ${Date.now() - dateNow}ms`);
    dateNow = Date.now();

    output.Loot = [];
    let count = 0;
    let counters = [];

    count = _MountedLootPush(mounted, output);
    logger.logInfo(`State Mounted, TimeElapsed: ${Date.now() - dateNow}ms`);
    dateNow = Date.now();

    counters.push(count);
    count = 0;
    count = _ForcedLootPush(forced, output);
    logger.logInfo(`State Forced, TimeElapsed: ${Date.now() - dateNow}ms`);
    dateNow = Date.now();

    counters.push(count);
    count = 0;
    count = _StaticsLootPush(statics, output);
    logger.logInfo(`State Containers, TimeElapsed: ${Date.now() - dateNow}ms`);
    dateNow = Date.now();

    counters.push(count);

    // dyanmic loot
    count = 0;
    count = _DynamicLootPush(dynamic, output, _location.base.GlobalLootChanceModifier);
    logger.logInfo(`State Dynamic, TimeElapsed: ${Date.now() - dateNow}ms`);
    dateNow = Date.now();

    counters.push(count);

    // Loot position list for filtering the lootItem in the same position.
    if (global.serverConfig.lootDebug) {
      logger.logSuccess(
        `Generated location ${name} with [mounted: ${counters[0]}/${mounted.length} | forcedLoot: ${counters[1]}/${forced.length} | statics: ${counters[2]}/${statics.length} | dynamic: ${counters[3]}/${dynamic.length}]`
      );
    }
    counters = null;

    return output;
  }

  getStaticLoot(_tpl) {
    for (let obj of this.location.loot.static) {
      if (obj.Items[0]._tpl == _tpl) return obj;
    }
  }
  // TODO: rework required - weard functions to replace later on ;)

  /* get a location with generated loot data */
  get(Location, sessionID) {
    let name = Location.toLowerCase().replace(" ", "");
    return this.generate(name, sessionID);
  }

  /* get all locations without loot data */
  generateAll() {
    // lets try to read from cache
    if (!utility.isUndefined(db.user.cache.locations)) {
      let base = global._database.core.location_base;
      let newData = {};
      for (let location in global._database.locations) {
        newData[global._database.locations[location].base._Id] = utility.wipeDepend(global._database.locations[location].base);
        newData[global._database.locations[location].base._Id].Loot = [];
      }
      base.locations = newData;
      return base;
    }
    throw "Missing file db/cacheBase/locations.json";
  }
}

module.exports.handler = new LocationServer();
