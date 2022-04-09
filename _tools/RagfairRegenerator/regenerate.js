const fs = require("fs");


const ReadParsed = (filename) => {
  return JSON.parse(fs.readFileSync(filename));
}
const Write = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, " "));
}
const ReadDir = (dirpath) => {
  return fs.readdirSync(dirpath);
}


const DatabasePath = "../../db/";
const Ragfair = DatabasePath + "traders/ragfair";
const ItemsDir = DatabasePath + "items";
const itemNodeFiles = ReadDir(ItemsDir);
let ItemsData = {};
for (let file in itemNodeFiles) {
  for (let items of ReadParsed(ItemsDir + "/" + itemNodeFiles[file])) {
    if (items._id == undefined) {
      logger.logWarning(`[Loading ItemsDB] file: ${file} looks to contain corrupted data`)
      continue;
    }
    ItemsData[items._id] = items;
  }
}

let ItemsForRagfair = [];
for(let itemId in ItemsData){
  if(ItemsData[itemId].hasOwnProperty("_props")){
    if(ItemsData[itemId]._props.hasOwnProperty("CanSellOnRagfair")){
      ItemsForRagfair.push(ItemsData[itemId]._id);
    }
  }
}

console.log("START OF LIST");
console.log(ItemsForRagfair);
console.log("END OF LIST");
console.log(ItemsForRagfair.length);

Write("RagfairItemList.json", ItemsForRagfair);