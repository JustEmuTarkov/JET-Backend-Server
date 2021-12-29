"use strict";

function main(sessionID) {
  if (!account_f.handler.isWiped(sessionID)) {
    updateTraders(sessionID);
    updatePlayerHideout(sessionID);
  }
}

function updateTraders(sessionID) {
  let update_per = 3600;
  let timeNow = Math.floor(Date.now() / 1000);
  dialogue_f.handler.removeExpiredItems(sessionID);

  // update each hour
  let tradersToUpdateList = trader_f.handler.getAllTraders(sessionID, true);
  for (let i = 0; i < tradersToUpdateList.length; i++) {
    if (tradersToUpdateList[i]._id == "ragfair") continue;

    update_per = global._database.gameplayConfig.trading.traderSupply[tradersToUpdateList[i]._id];
    if (tradersToUpdateList[i].nextResupply > timeNow) {
      continue;
    }
    tradersToUpdateList[i].nextResupply = timeNow + update_per;
    logger.logInfo(`Updating trader[${tradersToUpdateList[i]._id}] supply time data to ${tradersToUpdateList[i].nextResupply}`);
    trader_f.handler.setTraderBase(tradersToUpdateList[i]);
    if (tradersToUpdateList[i]._id === "579dc571d53a0658a154fbec") continue;

    if (typeof db.traders[tradersToUpdateList[i]._id] == "undefined") return;
    let assort = fileIO.readParsed(db.traders[tradersToUpdateList[i]._id].assort);

    for (let assortItem in assort) {
      if (typeof assort[assortItem].default == "undefined") {
        logger.logWarning(`Unable to find item assort default for scheme: ${assortItem} and trader: ${tradersToUpdateList[i]._id}`);
        continue;
      }

      assort[assortItem].currentStack = assort[assortItem].default.stack;
    }

    fileIO.write(db.traders[tradersToUpdateList[i]._id].assort, assort, true, false);

    trader_f.handler.saveTrader(tradersToUpdateList[i]._id);
  }
}

function updatePlayerHideout(sessionID) {
  let pmcData = profile_f.handler.getPmcProfile(sessionID);
  let recipes = fileIO.readParsed(db.user.cache.hideout_production);
  let solarPowerLevel = 0;
  let btcFarmCGs = 0;
  let isGeneratorOn;

  for (let area of pmcData.Hideout.Areas) {
    if (area.type == 18) {
      solarPowerLevel = area.level;
    }
  }
  for (let area in pmcData.Hideout.Areas) {
    switch (pmcData.Hideout.Areas[area].type) {
      case 4:
        isGeneratorOn = pmcData.Hideout.Areas[area].active;
        if (isGeneratorOn == true) {
          pmcData.Hideout.Areas[area] = updateFuel(pmcData, solarPowerLevel, area); //i know solapower is always false but let me find a workaround later
        }
        break;
      case 6:
        if (isGeneratorOn) {
          pmcData.Hideout.Areas[area] = updateWaterFilters(pmcData, area);
        }
        break;
      case 17:
        if (isGeneratorOn) {
          pmcData.Hideout.Areas[area] = updateAirFilters(pmcData, area);
        }
        break;

      case 20:
        for (let slot of pmcData.Hideout.Areas[area].slots) {
          if (slot.item != null) {
            btcFarmCGs++;
          }
        }
        break;
    }
  }

  // update production time
  for (let prod in pmcData.Hideout.Production) {
    if (pmcData.Hideout.Production[prod].inProgress == false) {
      continue;
    }

    let needGenerator = false;
    // Scav Case
    if (
      prod == "5d78d563c3024e58357e0f84" ||
      prod == "5d8381ecade7391cc1066d5e" ||
      prod == "5d83822aade7391cc1066d61" ||
      prod == "5dd129295a9ae32efe41a367" ||
      prod == "5e074e5e2108b14e1c62f2a7"
    ) {
      let time_elapsed = Math.floor(Date.now() / 1000) - pmcData.Hideout.Production[prod].StartTime - pmcData.Hideout.Production[prod].Progress;
      pmcData.Hideout.Production[prod].Progress += time_elapsed;
    }

    for (let recipe of recipes.data) {
      if (recipe._id == pmcData.Hideout.Production[prod].RecipeId) {
        if (recipe.continuous == true) {
          needGenerator = true;
        }
        // Bitcoin Farm
        if (pmcData.Hideout.Production[prod].RecipeId == "5d5c205bd582a50d042a3c0e") {
          pmcData.Hideout.Production[prod] = updateBitcoinFarm(pmcData.Hideout.Production[prod], recipe, btcFarmCGs, isGeneratorOn, pmcData);
        } else {
          let time_elapsed = Math.floor(Date.now() / 1000) - pmcData.Hideout.Production[prod].StartTimestamp - pmcData.Hideout.Production[prod].Progress;
          if (needGenerator == true && isGeneratorOn == false) {
            time_elapsed = time_elapsed * 0.2;
          }
          pmcData.Hideout.Production[prod].Progress += time_elapsed;
          // scavcase
          //if (prod == "14") {
          //  logger.logSuccess("I can see 14. will change progress.");
          //}
        }
        break;
      }
    }
  }
}
function updateWaterFilters(pmcData, area) {
  let waterFilterArea = pmcData.Hideout.Areas[area];
  // thanks to Alexter161
  let decreaseValue = 0.00333;
  decreaseValue *= hideout_f.getHideoutSkillDecreasedConsumption(pmcData); //

  for (let i = 0; i < waterFilterArea.slots.length; i++) {
    if (waterFilterArea.slots[i].item.upd === null || waterFilterArea.slots[i].item.upd === undefined) {
      continue;
    } else {
      let resourceValue = waterFilterArea.slots[i].item[0].upd && waterFilterArea.slots[i].item[0].upd.Resource ? waterFilterArea.slots[i].item[0].upd.Resource.Value : null;
      if (resourceValue == null) {
        resourceValue = 100 - decreaseValue;
      } else {
        resourceValue -= decreaseValue;
      }
      resourceValue = Math.round(resourceValue * 10000) / 10000;

      if (resourceValue > 0) {
        waterFilterArea.slots[i].item[0].upd = {
          StackObjectsCount: 1,
          Resource: {
            Value: resourceValue,
          },
        };
        logger.logInfo("Water filter: " + resourceValue + " filter time left on tank slot " + (i + 1));
      } else {
        waterFilterArea.slots[i].item[0] = null;
      }
      break;
    }
  }
  return waterFilterArea;
}
function updateFuel(pmcData, solarPower, area) {
  let generatorArea = pmcData.Hideout.Areas[area];
  let noFuelAtAll = true;
  let decreaseFuel = 0.0665;

  if (solarPower == 1) {
    decreaseFuel = 0.0332;
  }
  // Decrease fuel depleting number by percent from hideout skill
  // function return 1 if skill is 0 and 0.75 if skill is maxed out
  decreaseFuel *= hideout_f.getHideoutSkillDecreasedConsumption(pmcData); //

  for (let i = 0; i < generatorArea.slots.length; i++) {
    if (generatorArea.slots[i].item == null || generatorArea.slots[i].item === undefined) {
      continue;
    } else {
      let resourceValue =
        generatorArea.slots[i].item[0].upd != null && typeof generatorArea.slots[i].item[0].upd.Resource !== "undefined"
          ? generatorArea.slots[i].item[0].upd.Resource.Value
          : null;
      if (resourceValue == null) {
        resourceValue = 100 - decreaseFuel;
      } else {
        resourceValue -= decreaseFuel;
      }
      resourceValue = Math.round(resourceValue * 10000) / 10000;

      if (resourceValue > 0) {
        generatorArea.slots[i].item[0].upd = {
          StackObjectsCount: 1,
          Resource: {
            Value: resourceValue,
          },
        };
        logger.logInfo("Generator: " + resourceValue + " fuel left on tank slot " + (i + 1));
        noFuelAtAll = false;
        break; //break here to avoid update all the fuel tanks and only update if fuel Ressource > 0
      } //if fuel is empty, remove it
      else {
        generatorArea.slots[i].item[0].upd = {
          StackObjectsCount: 1,
          Resource: {
            Value: 0,
          },
        };
      }
    }
  }
  if (noFuelAtAll == true) {
    generatorArea.active = false;
  }

  return generatorArea;
}

function updateAirFilters(pmcData, area) {
  let airFilterArea = pmcData.Hideout.Areas[area];
  let decreaseValue = 0.00417;
  decreaseValue *= hideout_f.getHideoutSkillDecreasedConsumption(pmcData); //

  for (let i = 0; i < airFilterArea.slots.length; i++) {
    if (airFilterArea.slots[i].item == null || airFilterArea.slots[i].item === undefined) {
      continue;
    } else {
      let resourceValue =
        airFilterArea.slots[i].item[0].upd != null && typeof airFilterArea.slots[i].item[0].upd.Resource !== "undefined"
          ? airFilterArea.slots[i].item[0].upd.Resource.Value
          : null;
      if (resourceValue == null) {
        resourceValue = 300 - decreaseValue;
      } else {
        resourceValue -= decreaseValue;
      }
      resourceValue = Math.round(resourceValue * 10000) / 10000;

      if (resourceValue > 0) {
        airFilterArea.slots[i].item[0].upd = {
          StackObjectsCount: 1,
          Resource: {
            Value: resourceValue,
          },
        };
        logger.logInfo("Air filter: " + resourceValue + " filter time left on tank slot " + (i + 1));
      } else {
        airFilterArea.slots[i].item[0] = null;
      }
      break;
    }
  }
  return airFilterArea;
}

function updateBitcoinFarm(btcProd, farmrecipe, btcFarmCGs, isGeneratorOn, pmcData) {
  let MAX_BTC = 3;

  // Elite level HideoutManagement lets you create 5 BTC max, not 3.
  for (let k in pmcData.Skills.Common) {
    if (pmcData.Skills.Common[k].Id === "HideoutManagement") {
      if (pmcData.Skills.Common[k].Progress == 5100) {
        MAX_BTC = 5;
      }
    }
  }

  let production = fileIO.readParsed(db.user.cache.hideout_production).data.find((prodArea) => prodArea.areaType == 20);
  let time_elapsed = Math.floor(Date.now() / 1000) - btcProd.StartTimestamp;

  if (isGeneratorOn == true) {
    btcProd.Progress += time_elapsed;
  }

  let t2 = Math.pow(0.05 + ((btcFarmCGs - 1) / 49) * 0.15, -1); //THE FUNCTION TO REDUCE TIME OF PRODUCTION DEPENDING OF CGS
  let final_prodtime = Math.floor(t2 * (production.productionTime / 20));

  while (btcProd.Progress > final_prodtime) {
    if (btcProd.Products.length < MAX_BTC) {
      btcProd.Products.push({
        _id: utility.generateNewItemId(),
        _tpl: "59faff1d86f7746c51718c9c",
        upd: {
          StackObjectsCount: 1,
        },
      });
      btcProd.Progress -= final_prodtime;
      logger.logSuccess("Bitcoin produced on server.");
    } else {
      btcProd.Progress = 0;
    }
  }

  btcProd.StartTimestamp = Math.floor(Date.now() / 1000);
  return btcProd;
}

module.exports.main = main;
module.exports.updateTraders = updateTraders;
