
const fs = require('fs');
let mapDataLoot = require('./NewMapData.json');


let newLoot = {
	"forced": [],
	"mounted": [],
	"static": [],
	"dynamic": []
}

for(let loot in mapDataLoot){
	if(mapDataLoot[loot].IsStatic){
		newLoot.static.push(mapDataLoot[loot]);
	} else {
		newLoot.dynamic.push(mapDataLoot[loot]);
	}
}

fs.writeFileSync("./NewLootOut.json", JSON.stringify(newLoot));