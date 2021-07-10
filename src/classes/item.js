"use strict";

class ItemServer {
    constructor() {
        this.output = "";
        this.routes = {};
		this.routeStructure = {};
        this.resetOutput();
    }

    /* adds route to check for */
    addRoute(route, callback) {
        this.routes[route] = callback;
    }

	updateRouteStruct(){
		this.routeStructure = {
			"Eat": health_f.handler.offraidEat,
			"Heal": health_f.handler.offraidHeal,
			"RestoreHealth": health_f.handler.healthTreatment,
			"CustomizationWear": customization_f.wearClothing,
			"CustomizationBuy": customization_f.buyClothing,
			"HideoutUpgrade": hideout_f.upgrade,
			"HideoutUpgradeComplete": hideout_f.upgradeComplete,
			"HideoutContinuousProductionStart": hideout_f.continuousProductionStart,
			"HideoutSingleProductionStart": hideout_f.singleProductionStart,
			"HideoutScavCaseProductionStart": hideout_f.scavCaseProductionStart,
			"HideoutTakeProduction": hideout_f.takeProduction,
			"HideoutPutItemsInAreaSlots": hideout_f.putItemsInAreaSlots,
			"HideoutTakeItemsFromAreaSlots": hideout_f.takeItemsFromAreaSlots,
			"HideoutToggleArea": hideout_f.toggleArea,
			"Insure": insurance_f.insure,
			"Move": move_f.moveItem,
			"Remove": move_f.discardItem,
			"Split": move_f.splitItem,
			"Merge": move_f.mergeItem,
			"Transfer": move_f.transferItem,
			"Swap": move_f.swapItem,
			"AddNote": note_f.addNote,
			"EditNote": note_f.editNode,
			"DeleteNote": note_f.deleteNote,
			"QuestAccept": quest_f.acceptQuest,
			"QuestComplete": quest_f.completeQuest,
			"QuestHandover": quest_f.handoverQuest,
			"RagFairAddOffer": ragfair_f.ragFairAddOffer,
			"Repair": repair_f.main,
			"Fold": status_f.foldItem,
			"Toggle": status_f.toggleItem,
			"Tag": status_f.tagItem,
			"Bind": status_f.bindItem,
			"Examine": status_f.examineItem,
			"ReadEncyclopedia": status_f.readEncyclopedia,
			"TradingConfirm": trade_f.confirmTrading,
			"RagFairBuyOffer": trade_f.confirmRagfairTrading,
			"SaveBuild": weaponbuilds_f.saveBuild,
			"RemoveBuild": weaponbuilds_f.removeBuild,
			"AddToWishList": wishlist_f.addToWishList,
			"RemoveFromWishList": wishlist_f.removeFromWishList,
			"ApplyInventoryChanges": move_f.applyInventoryChanges,
			"CreateMapMarker": status_f.handleMapMarker 
		}
	}

	handleRoutes(info, sessionID) {
		this.resetOutput();

		for (let body of info.data) {
			let pmcData = profile_f.handler.getPmcProfile(sessionID);
			if (body.Action in this.routes) {
				this.routes[body.Action](pmcData, body, sessionID);
			} else {
				logger.logError(`[UNHANDLED ACTION] ${body.Action} with body ${body}`);
			}
		}
		return this.output;
	}


    getOutput(sessionID) {
        if (this.output === "") {
            this.resetOutput(sessionID);
        }

        return this.output;
    }

    setOutput(data) {
        this.output = data;
    }

    resetOutput(sessionID) {
		if(sessionID == "" || typeof sessionID == "undefined")
			return;
		const _profile = profile_f.handler.getPmcProfile(sessionID);
		//let _profile = {"_id": ""};
        this.output = {
		   "warnings":[],
		   "profileChanges":{}
		}
		this.output.profileChanges[_profile._id] = {
			 "_id": _profile._id,
			 "experience":0,
			 "quests":[],
			 "ragFairOffers":[],
			 "builds":[],
			 "items":{"change": [], "new": [], "del": []},
			 "production":null,
			 "skills":{
				"Common":[
					{"Id":"BotReload","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":-2147483648},
					{"Id":"BotSound","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":-2147483648},
					{"Id":"Endurance","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Strength","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Vitality","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Health","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"StressResistance","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Metabolism","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Immunity","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Perception","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Intellect","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Attention","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Charisma","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Memory","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Pistol","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Revolver","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"SMG","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Assault","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Shotgun","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Sniper","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"LMG","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"HMG","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Launcher","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"AttachedLauncher","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Throwing","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Melee","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"DMR","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"RecoilControl","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"AimDrills","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":-2147483648},
					{"Id":"Surgery","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":-2147483648},
					{"Id":"CovertMovement","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Search","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"MagDrills","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":-2147483648},
					{"Id":"Sniping","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"ProneMovement","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"FieldMedicine","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"FirstAid","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"LightVests","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"HeavyVests","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"WeaponModding","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"AdvancedModding","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"NightOps","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"SilentOps","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Lockpicking","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"WeaponTreatment","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Freetrading","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Auctions","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Cleanoperations","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Barter","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Shadowconnections","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Taskperformance","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"Crafting","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0},
					{"Id":"HideoutManagement","Progress":0,"PointsEarnedDuringSession":0,"LastAccess":0}
				],
				"Mastering":[],
				"Points":0
			 },
			 "traderRelations":[]
		};
    }
}

module.exports.handler = new ItemServer();
