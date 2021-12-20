const fs = require("fs")

const fileText = fs.readFileSync("../db/locations/loot/lighthouse.json");

const fileData = JSON.parse(fileText);

let table = [];

for(let lootSpawn of fileData.dynamic){
  let newName = lootSpawn.id.split(" ")[0].split("-")[0]
  if(table.indexOf(newName) == -1){
    table.push(newName)
  }
}

console.log(table);