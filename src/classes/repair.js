"use strict";

exports.main = (pmcData, body, sessionID) => {
    let output = item_f.handler.getOutput(sessionID);
    let trader = trader_f.handler.getTrader(body.tid, sessionID);

    const LoyaltyIndex = profile_f.calculateLoyalty(pmcData, body.tid);

    //calculation of price coeficient. Result is always 1 + coeficient shown in repair window.
    const coef = 1 + ((trader.loyaltyLevels[LoyaltyIndex].repair_price_coef) / 100);

    // find the item to repair
    for (let repairItem of body.repairItems) {
        let itemToRepair = undefined;

        for (let item of pmcData.Inventory.items) {
            if (item._id === repairItem._id) {
                itemToRepair = item;
                break;
            }
        }

        if (itemToRepair === undefined) {
            continue;
        }

        // updated repair cost to match with Repair window, taking into account loyalty levels
        // using ~~ to match repair window
        const repairCost = ~~(global._database.items[itemToRepair._tpl]._props.RepairCost * repairItem.count * coef);
        logger.logInfo("repCost: " + repairCost);//just to make sure we spend what the repair window say.

        if (!helper_f.payMoney(pmcData, { "scheme_items": [{ "id": repairItem._id, "count": repairCost }], "tid": body.tid }, sessionID)) {
            logger.logError("no money found");
            return "";
        }

        // change item durability
        const calculateDurability = utility.clamp(itemToRepair.upd.Repairable.Durability + repairItem.count, 0, itemToRepair.upd.Repairable.MaxDurability);

        itemToRepair.upd.Repairable.Durability = calculateDurability;
        itemToRepair.upd.Repairable.MaxDurability = calculateDurability;

        //repairing mask cracks
        if ("FaceShield" in itemToRepair.upd && itemToRepair.upd.FaceShield.Hits > 0) {
            itemToRepair.upd.FaceShield.Hits = 0;
        }
        if (typeof output.profileChanges[pmcData._id].items.change == "undefined") {
            output.profileChanges[pmcData._id].items.change = [];

        }
        output.profileChanges[pmcData._id].items.change.push(itemToRepair);
    }

    return output;
}