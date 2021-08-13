"use strict";

/*
 * Quest status values
 * 0 - Locked
 * 1 - AvailableForStart
 * 2 - Started
 * 3 - AvailableForFinish
 * 4 - Success
 * 5 - Fail
 * 6 - FailRestartable
 * 7 - MarkedAsFailed
 */

function getQuestsCache() {
  return fileIO.stringify(global._database.quests, true);
}

//Fix for new quests where previous quest already required to found in raid items as same ID
function getQuestsForPlayer(url, info, sessionID) {
  let _profile = profile_f.handler.getPmcProfile(sessionID);
  let quests = utility.wipeDepend(global._database.quests);

  for (let quest of quests) {
    if (getQuestStatus(_profile, quest._id) == "Success") {
      quest.conditions.AvailableForStart = [];
      quest.conditions.AvailableForFinish = [];
      quest.conditions.Fail = [];
    }
  }
  return quests;
}

function getCachedQuest(qid) {
  for (let quest of global._database.quests) {
    if (quest._id === qid) {
      return quest;
    }
  }

  return null;
}

function processReward(reward) {
  let rewardItems = [];
  let targets;
  let mods = [];

  // separate base item and mods, fix stacks
  for (let item of reward.items) {
    if (item._id === reward.target) {
      targets = helper_f.splitStack(item);
    } else {
      mods.push(item);
    }
  }

  // add mods to the base items, fix ids
  for (let target of targets) {
    let questItems = [target];

    for (let mod of mods) {
      questItems.push(helper_f.clone(mod));
    }

    rewardItems = rewardItems.concat(helper_f.replaceIDs(null, questItems));
  }

  return rewardItems;
}

/* Gets a flat list of reward items for the given quest and state
 * input: quest, a quest object
 * input: state, the quest status that holds the items (Started, Success, Fail)
 * output: an array of items with the correct maxStack
 */
function getQuestRewards(quest, state, pmcData, sessionID) {
  let questRewards = [];
  let output = item_f.handler.getOutput(sessionID);

  for (let reward of quest.rewards[state]) {
    switch (reward.type) {
      case "Item":
        questRewards = questRewards.concat(processReward(reward));
        break;
      case "Experience":
        pmcData.Info.Experience += parseInt(reward.value);
        break;
      case "TraderStanding":
        if (typeof pmcData.TradersInfo[reward.target] == "undefined") {
          pmcData.TradersInfo[reward.target] = {
            salesSum: 0,
            standing: 0,
            unlocked: true,
          };
        }
        pmcData.TradersInfo[reward.target].standing += parseFloat(reward.value);
        break;
      case "TraderUnlock":
        if (typeof pmcData.TradersInfo[reward.target] == "undefined") {
          pmcData.TradersInfo[reward.target] = {
            salesSum: 0,
            standing: 0,
            unlocked: true,
          };
        }

        pmcData.TradersInfo[reward.target].unlocked = true;
        break;
      case "AssortmentUnlock":
        /*
        items -> holds item to unlock in traders
        traderId -> trader id of the trader you unlock the item to
        loyaltyLevel -> level of the trader you unlock that item on
        target -> _id of the item to unlock (main part)
        */ break;
      case "Counter":
        break;
      case "Location":
        /* not used in game (can lock or unlock location suposedly...) */ break;
      case "Skill":
        let skills = pmcData.Skills.Common.filter((skill) => skill.Id == reward.target);
        for (const Id in skills) {
          pmcData.Skills.Common[Id].Progress += parseInt(reward.value);
        }
        /*	if we gonna use masterings increaser then yea ;)
        let masterings = pmcData.Skills.Mastering.filter(skill => skill.Id == reward.target);
        for(const Id in masterings) {
            pmcData.Skills.Common[Id].Progress += reward.value;
        }
        /*
        {
            "target": "Sniper",
            "value": "300",
            "id": "5d78ce4986f77437f7656bf2",
            "type": "Skill",
            "index": 0
        }
        */
        break;
    }
  }

  output.profileChanges[pmcData._id].experience = pmcData.Info.Experience;
  output.profileChanges[pmcData._id].traderRelations = pmcData.TradersInfo;

  // Quest items are found in raid !!
  for (let questItem of questRewards) {
    if (typeof questItem.upd == "undefined") questItem.upd = {};
    questItem.upd["SpawnedInSession"] = true;
  }
  return questRewards;
}

function acceptQuest(pmcData, body, sessionID) {
  let state = "Started";
  let found = false;

  // If the quest already exists, update its status
  for (const quest of pmcData.Quests) {
    if (quest.qid === body.qid) {
      quest.startTime = utility.getTimestamp();
      quest.status = state;
      found = true;
      break;
    }
  }

  // Otherwise, add it
  if (!found) {
    pmcData.Quests.push({
      qid: body.qid,
      startTime: utility.getTimestamp(),
      status: state,
    });
  }

  // Create a dialog message for starting the quest.
  // Note that for starting quests, the correct locale field is "description", not "startedMessageText".
  let quest = getCachedQuest(body.qid);
  let questLocale = locale_f.handler.getGlobal().quest;
  questLocale = questLocale[body.qid];
  let questRewards = getQuestRewards(quest, state, pmcData, sessionID);
  let messageContent = {
    templateId: locale_f.handler.getGlobal().mail[questLocale.startedMessageText],
    type: dialogue_f.getMessageTypeValue("questStart"),
    maxStorageTime: global._database.gameplayConfig.other.RedeemTime * 3600,
  };

  if (typeof messageContent.templateId == "undefined" || questLocale.startedMessageText === "") {
    messageContent = {
      templateId: questLocale.description,
      type: dialogue_f.getMessageTypeValue("questStart"),
      maxStorageTime: global._database.gameplayConfig.other.RedeemTime * 3600,
    };
  }

  dialogue_f.handler.addDialogueMessage(quest.traderId, messageContent, sessionID, questRewards);

  return item_f.handler.getOutput(sessionID);
}

function completeQuest(pmcData, body, sessionID) {
  let state = "Success";
  let intelCenterBonus = 0; //percentage of money reward

  //find if player has money reward boost
  for (let area of pmcData.Hideout.Areas) {
    if (area.type === 11) {
      if (area.level === 1) {
        intelCenterBonus = 5;
      }

      if (area.level > 1) {
        intelCenterBonus = 15;
      }
    }
  }

  for (let quest in pmcData.Quests) {
    if (pmcData.Quests[quest].qid === body.qid) {
      pmcData.Quests[quest].status = state;
      break;
    }
  }

  //Check if any of linked quest is failed, and that is unrestartable.
  for (const quest of pmcData.Quests) {
    if (!(quest.status === "Locked" || quest.status === "Success" || quest.status === "Fail")) {
      let checkFail = getCachedQuest(quest.qid);
      for (let failCondition of checkFail.conditions.Fail) {
        if (checkFail.restartable === false && failCondition._parent === "Quest" && failCondition._props.target === body.qid) {
          quest.status = "Fail";
        }
      }
    }
  }

  // give reward
  let quest = getCachedQuest(body.qid);

  if (intelCenterBonus > 0) {
    quest = applyMoneyBoost(quest, intelCenterBonus); //money = money + (money*intelCenterBonus/100)
  }

  let questRewards = getQuestRewards(quest, state, pmcData, sessionID);

  // Create a dialog message for completing the quest.
  let questDb = getCachedQuest(body.qid);
  let questLocale = global._database.locales.global["en"].quest;
  questLocale = questLocale[body.qid];
  let messageContent = {
    templateId: questLocale.successMessageText,
    type: dialogue_f.getMessageTypeValue("questSuccess"),
    maxStorageTime: global._database.gameplayConfig.other.RedeemTime * 3600,
  };
  let output = item_f.handler.getOutput(sessionID);
  if (typeof output.profileChanges[pmcData._id].quests == "undefined") output.profileChanges[pmcData._id].quests = [];
  let questForPlayerToUpdate = utility.wipeDepend(questDb);
  questForPlayerToUpdate.conditions.AvailableForStart = [];
  questForPlayerToUpdate.conditions.AvailableForFinish = [];
  questForPlayerToUpdate.conditions.Fail = [];
  output.profileChanges[pmcData._id].quests.push(questForPlayerToUpdate);

  //output.profileChanges[pmcData._id].quests[0]["status"] = "Success"; // there is no other way to finish quest for now (if there will be then it need ot be changed to proper status)
  item_f.handler.setOutput(output);
  dialogue_f.handler.addDialogueMessage(questDb.traderId, messageContent, sessionID, questRewards);
  return output;
}

function handoverQuest(pmcData, body, sessionID) {
  const quest = getCachedQuest(body.qid);
  let output = item_f.handler.getOutput(sessionID);
  let types = ["HandoverItem", "WeaponAssembly"];
  let handoverMode = true;
  let value = 0;
  let counter = 0;
  let amount;

  // Set the counter to the backend counter if it exists.
  for (let k in pmcData.BackendCounters) {
    if (pmcData.BackendCounters[k].qid === body.qid) {
      try {
        counter = pmcData.BackendCounters[k].value > 0 ? pmcData.BackendCounters[k].value : 0;
      } catch (_) {}
    }
  }

  for (let condition of quest.conditions.AvailableForFinish) {
    if (condition._props.id === body.conditionId && types.includes(condition._parent)) {
      value = parseInt(condition._props.value);
      handoverMode = condition._parent === types[0];
      break;
    }
  }

  if (handoverMode && value === 0) {
    logger.logError(`Quest handover error: condition not found or incorrect value. qid=${body.qid}, condition=${body.conditionId}`);
    return output;
  }

  for (let itemHandover of body.items) {
    // remove the right quantity of given items
    amount = Math.min(itemHandover.count, value - counter);
    counter += amount;
    if (itemHandover.count - amount >= 0) {
      changeItemStack(pmcData, itemHandover.id, itemHandover.count - amount, output);

      if (counter === value || counter > value) {
        break;
      }
    } else {
      // for weapon handover quests, remove the item and its children.
      let toRemove = helper_f.findAndReturnChildren(pmcData, itemHandover.id);
      let index = pmcData.Inventory.items.length;

      // important: don't tell the client to remove the attachments, it will handle it
      if (typeof output.profileChanges[pmcData._id].items.del == "undefined") output.profileChanges[pmcData._id].items.del = [];
      output.items.del.push({ _id: itemHandover.id });
      counter = 1;

      // important: loop backward when removing items from the array we're looping on
      while (index-- > 0) {
        if (toRemove.includes(pmcData.Inventory.items[index]._id)) {
          pmcData.Inventory.items.splice(index, 1);
        }
      }
    }
  }

  if (body.conditionId in pmcData.BackendCounters) {
    pmcData.BackendCounters[body.conditionId].value += counter;
  } else {
    pmcData.BackendCounters[body.conditionId] = { id: body.conditionId, qid: body.qid, value: counter };
  }

  return output;
}

function applyMoneyBoost(quest, moneyBoost) {
  for (let reward of quest.rewards.Success) {
    if (reward.type === "Item") {
      if (helper_f.isMoneyTpl(reward.items[0]._tpl)) {
        reward.items[0].upd.StackObjectsCount += Math.round((reward.items[0].upd.StackObjectsCount * moneyBoost) / 100);
      }
    }
  }

  return quest;
}

/* Sets the item stack to value, or delete the item if value <= 0 */
// TODO maybe merge this function and the one from customization
function changeItemStack(pmcData, id, value, output) {
  for (let inventoryItem in pmcData.Inventory.items) {
    if (pmcData.Inventory.items[inventoryItem]._id === id) {
      if (value > 0) {
        let item = pmcData.Inventory.items[inventoryItem];

        item.upd.StackObjectsCount = value;
        if (typeof output.profileChanges[pmcData._id].items.change == "undefined") output.profileChanges[pmcData._id].items.change = [];
        output.profileChanges[pmcData._id].items.change.push({
          _id: item._id,
          _tpl: item._tpl,
          parentId: item.parentId,
          slotId: item.slotId,
          location: item.location,
          upd: { StackObjectsCount: item.upd.StackObjectsCount },
        });
      } else {
        if (typeof output.profileChanges[pmcData._id].items.del == "undefined") output.profileChanges[pmcData._id].items.del = [];
        output.profileChanges[pmcData._id].items.del.push({ _id: id });
        pmcData.Inventory.items.splice(inventoryItem, 1);
      }

      break;
    }
  }
}

function getQuestStatus(pmcData, questID) {
  for (let quest of pmcData.Quests) {
    if (quest.qid === questID) {
      return quest.status;
    }
  }

  return "Locked";
}

module.exports.getQuestsCache = getQuestsCache;
module.exports.getQuestsForPlayer = getQuestsForPlayer;
module.exports.acceptQuest = acceptQuest;
module.exports.completeQuest = completeQuest;
module.exports.handoverQuest = handoverQuest;
module.exports.getQuestStatus = getQuestStatus;
