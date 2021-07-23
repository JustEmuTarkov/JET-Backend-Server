const fs = require('fs');

const traders = [
	"5a7c2eca46aef81a7ca2145d",
	"5ac3b934156ae10c4430e83c",
	"5c0647fdd443bc2504c2d371",
	"54cb50c76803fa8b248b4571",
	"54cb57776803fa99248b456e",
	"579dc571d53a0658a154fbec",
	"5935c25fb3acc3127c3d8cd9",
	"58330581ace78e27b8b10cee"
]

for(const trader of traders){
	console.log(trader);
	let loadAssort = JSON.parse(fs.readFileSync("./"+trader+"/assort.json"));
	for(const assortId in loadAssort){
		for(let item in loadAssort[assortId].items)
		{
			if(typeof loadAssort[assortId].items[item].parentId != "undefined"){
				if(loadAssort[assortId].items[item].parentId == "hideout"){
					
					loadAssort[assortId].default = {};
					loadAssort[assortId].default["unlimited"] = loadAssort[assortId].items[item].upd.UnlimitedCount;
					loadAssort[assortId].default["stack"] = loadAssort[assortId].items[item].upd.StackObjectsCount;
					delete loadAssort[assortId].items[item].upd;
				}
			}
		}
	}
	fs.writeFileSync("./"+trader+"/assort_new.json", JSON.stringify(loadAssort));
}

