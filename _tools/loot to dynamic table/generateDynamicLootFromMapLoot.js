
// THIS FILE SHOULD BE LOCATED IN db/locations/* 

const fs = require("fs");

const lootPath = "./loot";

const lootMaps = fs.readdirSync(lootPath);

var DynamicLootTable = {};

const ItemPresets = JSON.parse(fs.readFileSync("../base/SpawnPresets.json"));

for(let mapFile of lootMaps)
{
    if(!mapFile.includes(".json")) continue;

    let mapData = JSON.parse(fs.readFileSync(lootPath + "/" + mapFile));
    const mapName = mapFile.replace(".json", "");
    DynamicLootTable[mapName] = {};
    // let TotalItems = [];
    // for(let data of mapData.mounted){
      
      // if(data.id.toLowerCase().indexOf("utes") != -1 || data.id.toLowerCase().indexOf("ags") != -1)
        // continue;
      
      // let newItems = [];
      // for(let item of data.Items){
        // let dta = Object.values(ItemPresets).filter((preset) => preset._encyclopedia && preset._encyclopedia == item);
        // if(dta.length > 0){
          // newItems.push(item);
          // TotalItems.push(item);
        // }
      // }
      // data.Items = newItems;
      // //if(data.Items.length == 0)
      // //  console.log("EMPTY!!! " + data.id);
    // }
    // for(let data of mapData.mounted){
      
        // if(data.id.toLowerCase().indexOf("utes") != -1 || data.id.toLowerCase().indexOf("ags") != -1)
          // continue;
        
        // data.Items = TotalItems;
    // }  
    // fs.writeFileSync(lootPath + "/" + mapFile, JSON.stringify(mapData, null, " "))
    for(let data of mapData.dynamic)
    {
        //console.log(data.id);
        let startsWith = data.id.replace(/\(Clone\)/, "");
        startsWith = startsWith.replace(/[0-9]{8,10}/, "");
        startsWith = startsWith.replace(/[0-9]{7}/, "");
        startsWith = startsWith.replace(/[0-9]{6}/, "");
        startsWith = startsWith.replace(/ \([0-9]{1,3}\)/, "");
        startsWith = startsWith.replace(/  \[[0-9]{1,3}\]/, "");
        startsWith = startsWith.replace(/ \[[0-9]{1,3}\]/, "");
        startsWith = startsWith.replace(/ \([0-9]{1,3}\)/, "");
        startsWith = startsWith.replace(/_inpath[0-9]{1,2}.[0-9]{1,3}/, "");
        
        //.replace(/([a-z]{3})([0-9]{1,2})/, '$1');//.replace(/(Loot [0-9]{1,3})([0-9]{1,5})/, '$1');
        let name = startsWith.replace("(", "").replace(")", "");
        let SpawnList = data.Items;
        startsWith = startsWith.toLowerCase();
        if(typeof DynamicLootTable[mapName][startsWith] != "undefined"){

            for(let item of SpawnList)
            {
                if(DynamicLootTable[mapName][startsWith].SpawnList.includes(item)) continue;
                //console.log(startsWith + " SpawnLoot ++ " + item)
                DynamicLootTable[mapName][startsWith].SpawnList.push(item);
            }
        } else {
            //console.log(startsWith)
            DynamicLootTable[mapName][startsWith] = {
                "Name": name,
                "SpawnList": SpawnList
            };
        }
    }
    //break;
    console.log(mapName);
    //break;
    //str.replace(/[0-9]{7}/g, "");
}
fs.writeFileSync("DynamicLootTable_gen.json", JSON.stringify(DynamicLootTable, null, " "));