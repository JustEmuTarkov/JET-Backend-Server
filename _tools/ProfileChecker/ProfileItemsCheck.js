
// This will check if items in profiles there are items that are not existing anywhere in items.json

const profileLocation = "../../db/profile/"
let fileIO = require("../standalone.fileIO.js");

const profiles = fileIO.readDir(profileLocation);
const items = require("../../user/cache/items.json").data;

for(const profileName of profiles){
    const inventoryBear = fileIO.readParsed(profileLocation + profileName + "/inventory_bear.json");
    const inventoryUsec = fileIO.readParsed(profileLocation + profileName + "/inventory_usec.json");
    console.log(`- Profile: ${profileName} -`)
    console.log(`Inventory: Bear`);
    for(const item of inventoryBear.items){
        if(typeof items[item._tpl] == "undefined"){
            console.log(`Item not exist: ${item._tpl} as item id: ${item._id}`);
        }
    }
    console.log(`Inventory: Usec`);
    for(const item of inventoryUsec.items){
        if(typeof items[item._tpl] == "undefined"){
            console.log(`Item not exist: ${item._tpl} as item id: ${item._id}`);
        }
    }
}

