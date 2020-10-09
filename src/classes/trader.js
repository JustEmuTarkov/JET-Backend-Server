"use strict";

/* TraderServer class maintains list of traders for each sessionID in memory. */
class TraderServer {
    constructor() {
        this.traders = {};
        this.assorts = {};
    }

    /* Load all the traders into memory. */
    initialize() {
        for (let traderID in db.cacheBase.traders) {
            this.traders[traderID] = json.parse(json.read(db.cacheBase.traders[traderID].base));
            this.traders[traderID].sell_category = json.parse(json.read(db.cacheBase.traders[traderID].categories));
        }
    }

    getTrader(traderID) {
        return this.traders[traderID];
    }

    changeTraderDisplay(traderID, status, sessionID) {
        let pmcData = profile_f.profileServer.getPmcProfile(sessionID);
        pmcData.TraderStandings[traderID].display = status;
    }

    getAllTraders(sessionID) {
        let pmcData = profile_f.profileServer.getPmcProfile(sessionID);
        let traders = [];

        for (let traderID in this.traders) {
            if (traderID === "ragfair") {
                continue;
            }

            if (!(traderID in pmcData.TraderStandings)) {
                this.resetTrader(sessionID, traderID);
            }

            let trader = this.traders[traderID];

            trader.display = pmcData.TraderStandings[traderID].display;
            trader.loyalty.currentLevel = pmcData.TraderStandings[traderID].currentLevel;
            trader.loyalty.currentStanding = pmcData.TraderStandings[traderID].currentStanding;
            trader.loyalty.currentSalesSum = pmcData.TraderStandings[traderID].currentSalesSum;
            traders.push(trader);
        }

        return traders;
    }

    lvlUp(traderID, sessionID) {
        let pmcData = profile_f.profileServer.getPmcProfile(sessionID);
        let loyaltyLevels = this.traders[traderID].loyalty.loyaltyLevels;

        // level up player
        pmcData.Info.Level = profile_f.calculateLevel(pmcData);

        // level up traders
        let targetLevel = 0;

        for (let level in loyaltyLevels) {
            if ((loyaltyLevels[level].minLevel <= pmcData.Info.Level
                && loyaltyLevels[level].minSalesSum <= pmcData.TraderStandings[traderID].currentSalesSum
                && loyaltyLevels[level].minStanding <= pmcData.TraderStandings[traderID].currentStanding)
                && targetLevel < 4) {
                // level reached
                targetLevel++;
            }
        }

        // set level
        pmcData.TraderStandings[traderID].currentLevel = targetLevel;
        this.traders[traderID].loyalty.currentLevel = targetLevel;
    }

    resetTrader(sessionID, traderID) {
        let account = account_f.accountServer.find(sessionID);
        let pmcData = profile_f.profileServer.getPmcProfile(sessionID);
        let traderWipe = json.parse(json.read(db.profile[account.edition]["trader_" + pmcData.Info.Side.toLowerCase()]));

        pmcData.TraderStandings[traderID] = {
            "currentLevel": 1,
            "currentSalesSum": traderWipe.initialSalesSum,
            "currentStanding": traderWipe.initialStanding,
            "NextLoyalty": null,
            "loyaltyLevels": this.traders[traderID].loyalty.loyaltyLevels,
            "display": this.traders[traderID].display
        };

        this.lvlUp(traderID, sessionID);
    }

    getAssort(sessionID, traderID) {
        if (!(traderID in this.assorts)) {
            if (traderID === "579dc571d53a0658a154fbec") {
                logger.logWarning("generating fence");
                this.generateFenceAssort();
            } else {
                let tmp = json.parse(json.read(db.user.cache["assort_" + traderID]));
                this.assorts[traderID] = tmp.data;
            }
        }

        let baseAssorts = this.assorts[traderID];

        // Build what we're going to return.
        let assorts = this.copyFromBaseAssorts(baseAssorts);

        let pmcData = profile_f.profileServer.getPmcProfile(sessionID);

        if (traderID !== "ragfair") {
            // 1 is min level, 4 is max level
            let level = this.traders[traderID].loyalty.currentLevel;
			let questassort = {};
			if(typeof db.traders[traderID].questassort == "undefined")
			{
				questassort = {"started": {},"success": {},"fail": {}};
			} else if(json.exist(db.traders[traderID].questassort)){
				questassort = json.parse(json.read(db.traders[traderID].questassort));
			} else {
				questassort = {"started": {},"success": {},"fail": {}};
			}

            for (let key in baseAssorts.loyal_level_items) {
                    let requiredLevel = baseAssorts.loyal_level_items[key];
                    if (requiredLevel > level) {
                        assorts = this.removeItemFromAssort(assorts, key);
                        continue;
                    }

                    if (key in questassort.started && quest_f.getQuestStatus(pmcData, questassort.started[key]) !== "Started") {
                        assorts = this.removeItemFromAssort(assorts, key);
                        continue;
                    }

                    if (key in questassort.success && quest_f.getQuestStatus(pmcData, questassort.success[key]) !== "Success") {
                        assorts = this.removeItemFromAssort(assorts, key);
                        continue;
                    }

                    if (key in questassort.fail && quest_f.getQuestStatus(pmcData, questassort.fail[key]) !== "Fail") {
                        assorts = this.removeItemFromAssort(assorts, key);
                    }
                }
        }

        return assorts;
    }

    generateFenceAssort() {
        let fenceId = "579dc571d53a0658a154fbec";
        let base = {"err": 0, "errmsg": null, "data": {"items": [], "barter_scheme": {}, "loyal_level_items": {}}};
        let names = Object.keys(db.assort[fenceId].loyal_level_items);
        let added = [];

        for (let i = 0; i < gameplayConfig.trading.fenceAssortSize; i++) {
            let traderID = names[utility.getRandomInt(0, names.length - 1)];

            if (added.includes(traderID)) {
                i--;
                continue;
            }

            added.push(traderID);

            //it's the item
            if (!(traderID in globals.data.ItemPresets)) {
				let TraderData = json.parse(json.read(db.user.cache.assort_579dc571d53a0658a154fbec)).data;
                base.data.items.push(TraderData.items[traderID]);
                base.data.barter_scheme[traderID] = TraderData.barter_scheme[traderID];
                base.data.loyal_level_items[traderID] = TraderData.loyal_level_items[traderID];
                continue;
            }

            //it's itemPreset
            let rub = 0;
            let itemPresets = json.parse(json.stringify(globals.data.ItemPresets[traderID]._items, true));
            let ItemRootOldId = globals.data.ItemPresets[traderID]._parent;

            for (let i = 0; i < itemPresets.length; i++) {
                let mod = itemPresets[i];

                //build root Item info
                if (!("parentId" in mod)) {
                    mod._id = traderID;
                    mod.parentId = "hideout"
                    mod.slotId = "hideout";
                    mod.upd = {
                        "UnlimitedCount": true,
                        "StackObjectsCount": 999999999
                    }
                } else if (mod.parentId == ItemRootOldId) {
                    mod.parentId = traderID;
                }
            }

            base.data.items.push.apply(base.data.items, itemPresets);

            //calculate preset price
            for (let it of itemPresets) {
                rub += helper_f.getTemplatePrice(it._tpl);
            }

            base.data.barter_scheme[traderID] = json.parse(json.read(db.assort[fenceId].barter_scheme[traderID]));
            base.data.barter_scheme[traderID][0][0].count = rub;
            base.data.loyal_level_items[traderID] = json.parse(json.read(db.assort[fenceId].loyal_level_items[traderID]));
        }

        this.assorts[fenceId] = base.data;
    }

    // Deep clone (except for the actual items) from base assorts. 
    copyFromBaseAssorts(baseAssorts) {
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
    removeItemFromAssort(assort, itemID) {
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

    getCustomization(traderID, sessionID) {
        let pmcData = profile_f.profileServer.getPmcProfile(sessionID);
        let allSuits = customization_f.getCustomization();
        let suitArray = json.parse(json.read(db.user.cache["customization_" + traderID]));
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

        for (let traderID in this.traders) {
            if (db.user.cache["customization_" + traderID] !== undefined) {
                output = output.concat(this.getCustomization(traderID, sessionID));
            }
        }

        return output;
    }

    getPurchasesData(traderID, sessionID) {
        let pmcData = profile_f.profileServer.getPmcProfile(sessionID);
        let trader = this.traders[traderID];
        let currency = helper_f.getCurrency(trader.currency);
        let output = {};

        // get sellable items
        for (let item of pmcData.Inventory.items) {
            let price = 0;

            if (item._id === pmcData.Inventory.equipment
                || item._id === pmcData.Inventory.stash
                || item._id === pmcData.Inventory.questRaidItems
                || item._id === pmcData.Inventory.questStashItems
                || helper_f.isNotSellable(item._tpl)
                || traderFilter(trader.sell_category, item._tpl) === false) {
                continue;
            }

            // find all child of the item (including itself) and sum the price 
            for (let childItem of helper_f.findAndReturnChildrenAsItems(pmcData.Inventory.items, item._id)) {
                let tempPrice = (items.data[childItem._tpl]._props.CreditsPrice >= 1) ? items.data[childItem._tpl]._props.CreditsPrice : 1;
                let count = ("upd" in childItem && "StackObjectsCount" in childItem.upd) ? childItem.upd.StackObjectsCount : 1;
                price = price + (tempPrice * count);
            }

            // dogtag calculation
            if ("upd" in item && "Dogtag" in item.upd && helper_f.isDogtag(item._tpl)) {
                price *= item.upd.Dogtag.Level;
            }

            // meds calculation
            let hpresource = ("upd" in item && "MedKit" in item.upd) ? item.upd.MedKit.HpResource : 0;

            if (hpresource > 0) {
                let maxHp = helper_f.getItem(item._tpl)[1]._props.MaxHpResource;
                price *= (hpresource / maxHp);
            }

            // weapons and armor calculation
            let repairable = ("upd" in item && "Repairable" in item.upd) ? item.upd.Repairable : 1;

            if (repairable !== 1) {
                price *= (repairable.Durability / repairable.MaxDurability)
            }

            // get real price
            if (trader.discount > 0) { price -= (trader.discount / 100) * price }
            price = helper_f.fromRUB(price, currency);
            price = (price > 0 && price !== "NaN") ? price : 1;

            output[item._id] = [[{ "_tpl": currency, "count": price.toFixed(0) }]];
        }

        return output;
    }
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

module.exports.traderServer = new TraderServer();