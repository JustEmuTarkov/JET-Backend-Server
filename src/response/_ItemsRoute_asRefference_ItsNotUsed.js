"use strict";

item_f.itemServer.addRoute("Eat", health_f.healthServer.offraidEat);
item_f.itemServer.addRoute("Heal", health_f.healthServer.offraidHeal);
item_f.itemServer.addRoute("RestoreHealth", health_f.healthServer.healthTreatment);

item_f.itemServer.addRoute("CustomizationWear", customization_f.wearClothing);
item_f.itemServer.addRoute("CustomizationBuy", customization_f.buyClothing);

item_f.itemServer.addRoute("HideoutUpgrade", hideout_f.upgrade);
item_f.itemServer.addRoute("HideoutUpgradeComplete", hideout_f.upgradeComplete);
item_f.itemServer.addRoute("HideoutContinuousProductionStart", hideout_f.continuousProductionStart);
item_f.itemServer.addRoute("HideoutSingleProductionStart", hideout_f.singleProductionStart);
item_f.itemServer.addRoute("HideoutScavCaseProductionStart", hideout_f.scavCaseProductionStart);
item_f.itemServer.addRoute("HideoutTakeProduction", hideout_f.takeProduction);
item_f.itemServer.addRoute("HideoutPutItemsInAreaSlots", hideout_f.putItemsInAreaSlots);
item_f.itemServer.addRoute("HideoutTakeItemsFromAreaSlots", hideout_f.takeItemsFromAreaSlots);
item_f.itemServer.addRoute("HideoutToggleArea", hideout_f.toggleArea);

item_f.itemServer.addRoute("Insure", insurance_f.insure);

item_f.itemServer.addRoute("Move", move_f.moveItem);
item_f.itemServer.addRoute("Remove", move_f.discardItem);
item_f.itemServer.addRoute("Split", move_f.splitItem);
item_f.itemServer.addRoute("Merge", move_f.mergeItem);
item_f.itemServer.addRoute("Transfer", move_f.transferItem);
item_f.itemServer.addRoute("Swap", move_f.swapItem);

item_f.itemServer.addRoute("AddNote", note_f.addNote);
item_f.itemServer.addRoute("EditNote", note_f.editNode);
item_f.itemServer.addRoute("DeleteNote", note_f.deleteNote);

item_f.itemServer.addRoute("QuestAccept", quest_f.acceptQuest);
item_f.itemServer.addRoute("QuestComplete", quest_f.completeQuest);
item_f.itemServer.addRoute("QuestHandover", quest_f.handoverQuest);

item_f.itemServer.addRoute("RagFairAddOffer", ragfair_f.ragFairAddOffer);

item_f.itemServer.addRoute("Repair", repair_f.main);

item_f.itemServer.addRoute("Fold", status_f.foldItem);
item_f.itemServer.addRoute("Toggle", status_f.toggleItem);
item_f.itemServer.addRoute("Tag", status_f.tagItem);
item_f.itemServer.addRoute("Bind", status_f.bindItem);
item_f.itemServer.addRoute("Examine", status_f.examineItem);
item_f.itemServer.addRoute("ReadEncyclopedia", status_f.readEncyclopedia);

item_f.itemServer.addRoute("TradingConfirm", trade_f.confirmTrading);
item_f.itemServer.addRoute("RagFairBuyOffer", trade_f.confirmRagfairTrading);

item_f.itemServer.addRoute("SaveBuild", weaponBuilds_f.saveBuild);
item_f.itemServer.addRoute("RemoveBuild", weaponBuilds_f.removeBuild);

item_f.itemServer.addRoute("AddToWishList", wishList_f.addToWishList);
item_f.itemServer.addRoute("RemoveFromWishList", wishList_f.removeFromWishList);