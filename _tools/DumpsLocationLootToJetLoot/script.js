
const fs = require('fs');

const questItemID = ["5b4c72c686f77462ac37e907","5b4c72b386f7745b453af9c0","5af04c0b86f774138708f78e","5b4c72fb86f7745cef1cffc5","5af04e0a86f7743a532b79e2","5a29284f86f77463ef3db363","5a29276886f77435ed1b117c","609267a2bb3f46069c3e6c7d","60c080eb991ac167ad1c3ad4","5939e9b286f77462a709572c","590c62a386f77412b0130255","591092ef86f7747bb8703422","5a29357286f77409c705e025","5939e5a786f77461f11c0098","591093bb86f7747caa7bb2ee","5a294d8486f774068638cd93","5c12301c86f77419522ba7e4","5ac620eb86f7743a8e6e0da0","5ae9a1b886f77404c8537c62","5a294d7c86f7740651337cf9","5ae9a18586f7746e381e16a3","5ae9a3f586f7740aab00e4e6","5a6860d886f77411cd3a9e47","5ae9a0dd86f7742e5f454a05","593965cf86f774087a77e1b6","5ae9a4fc86f7746e381e1753","5938188786f77474f723e87f","5d357d6b86f7745b606e3508","5d3ec50586f774183a607442","5938878586f7741b797c562f","5ae9a25386f7746dd946e6d9","5eff135be0d3331e9d282b7b","5efdaf6de6a30218ed211a48","5efdafc1e70b5e33f86de058","608c22a003292f4ba43f8a1a","60a3b5b05f84d429b732e934","60915994c49cf53e4772cc38","60a3b6359c427533db36cf84","60a3b65c27adf161da7b6e14","5937fd0086f7742bf33fc198","5a0448bc86f774736f14efa8","590dde5786f77405e71908b2","5910922b86f7747d96753483","5939a00786f7742fe8132936","5a687e7886f7740c4a5133fb","5b4c81a086f77417d26be63f","5b43237186f7742f3a4ab252","593a87af86f774122f54a951","5b4c81bd86f77418a75ae159"];
	
function GenerateStaticShort(loot)
{
	let shorten = {
		"id": loot.Id,
		"Position": 0,
		"Rotation": 0,
		"Items": []
	}
	if(typeof loot.Id == "undefined")
		shorten.id = loot.id;
	
	shorten.Items.push(loot.Items[0]);
	if(loot.IsStatic){
		shorten["IsStatic"] = true;
	}
	if(loot.useGravity){
		shorten["useGravity"] = true;
	}
	if(loot.randomRotation){
		shorten["randomRotation"] = true;
	}
	if(loot.IsGroupePosition){
		shorten["IsGroupePosition"] = true;
		shorten["GroupPositions"] = loot.GroupPositions;
	}
	if((loot.Position.x != "0" && loot.Position.x != 0) || (loot.Position.y != "0" && loot.Position.y != 0) || (loot.Position.z != "0" && loot.Position.z != 0)){
		shorten.Position = loot.Position;
	}
	if((loot.Rotation.x != "0" && loot.Rotation.x != 0) || (loot.Rotation.y != "0" && loot.Rotation.y != 0) || (loot.Rotation.z != "0" && loot.Rotation.z != 0)){
		shorten.Rotation = loot.Rotation;
	}
	return shorten;
}
function GenerateDynamicShort(loot)
{
	/*
	{
		"id": item_data.id,
		"data": [
			{
				"Id": item_data.id,
				"IsStatic": isStatic,
				"useGravity": useGravity,
				"randomRotation": randomRotation,
				"Position": position,
				"Rotation": rotation,
				"IsGroupPosition": false,
				"GroupPositions": [],
				"Root": item_data.Items[0]._id,
				"Items": item_data.Items
			}
		]
	}
	*/
	let shorten = {
		"id": loot.Id,
		"Position": 0,
		"Rotation": 0,
		"Items": []
	}

	if(typeof loot.Id == "undefined")
		shorten.id = loot.id;
	
	let loot_2 = loot;
	if(typeof loot.data != "undefined")
		loot_2 = loot.data[0];
	
	for(const data in loot.Items){
		shorten.Items.push(loot.Items[data]._tpl);
	}
	//shorten.Items = loot_2.Items;
	if(loot_2.IsStatic === true){
		shorten["IsStatic"] = true;
	}
	if(loot_2.useGravity === true){
		shorten["useGravity"] = true;
	}
	if(loot_2.randomRotation === true){
		shorten["randomRotation"] = true;
	}
	if(loot_2.IsGroupePosition === true){
		shorten["IsGroupePosition"] = true;
		shorten["GroupPositions"] = loot_2.GroupPositions;
	}
	if((loot_2.Position.x != "0" && loot_2.Position.x != 0) || (loot_2.Position.y != "0" && loot_2.Position.y != 0) || (loot_2.Position.z != "0" && loot_2.Position.z != 0)){
		shorten.Position = loot_2.Position;
	}
	if((loot_2.Rotation.x != "0" && loot_2.Rotation.x != 0) || (loot_2.Rotation.y != "0" && loot_2.Rotation.y != 0) || (loot_2.Rotation.z != "0" && loot_2.Rotation.z != 0)){
		shorten.Rotation = loot_2.Rotation;
	}
	return shorten;
}
function GenerateForcedShort(loot)
{
	let shorten = {
		"id": loot.Id,
		"Position": 0,
		"Rotation": 0,
		"Items": []
	}
	if(typeof loot.Id == "undefined")
		shorten.id = loot.id;
	//shorten.id = loot.id;
	for(const data in loot.Items){
		shorten.Items.push(loot.Items[data]._tpl);
	}
	if(loot.IsStatic){
		shorten["IsStatic"] = true;
	}
	if(loot.useGravity){
		shorten["useGravity"] = true;
	}
	if(loot.randomRotation){
		shorten["randomRotation"] = true;
	}
	if(loot.IsGroupePosition){
		shorten["IsGroupePosition"] = true;
		shorten["GroupPositions"] = loot.GroupPositions;
	}
	if((loot.Position.x != "0" && loot.Position.x != 0) || (loot.Position.y != "0" && loot.Position.y != 0) || (loot.Position.z != "0" && loot.Position.z != 0)){
		shorten.Position = loot.Position;
	}
	if((loot.Rotation.x != "0" && loot.Rotation.x != 0) || (loot.Rotation.y != "0" && loot.Rotation.y != 0) || (loot.Rotation.z != "0" && loot.Rotation.z != 0)){
		shorten.Rotation = loot.Rotation;
	}
	return shorten;
}
function GenerateMountedShort(loot)
{
	let shorten = {
		"id": "",
		"Position": 0,
		"Rotation": 0,
		"Items": []
	}
	shorten.id = loot.id;
	shorten.Items = loot.Items;
	if(loot.IsStatic){
		shorten["IsStatic"] = true;
	}
	if(loot.useGravity){
		shorten["useGravity"] = true;
	}
	if(loot.randomRotation){
		shorten["randomRotation"] = true;
	}
	if(loot.IsGroupePosition){
		shorten["IsGroupePosition"] = true;
		shorten["GroupPositions"] = loot.GroupPositions;
	}
	if(loot.Position.x != "0" || loot.Position.y != "0" || loot.Position.z != "0"){
		shorten.Position = loot.Position;
	}
	if(loot.Rotation.x != "0" || loot.Rotation.y != "0" || loot.Rotation.z != "0"){
		shorten.Rotation = loot.Rotation;
	}
	return shorten;
}
//let read_dir = fs.readdirSync('./maps');

function loadParsed(file){
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}
//const oldLootMaps = loadParsed('./locations_old.json');
const maps = [
  "Lighthouse",
	"bigmap",
	//"develop",
	"factory4_day",
	"factory4_night",
	"Interchange",
	"Laboratory",
	"RezervBase",
	"Shoreline",
	"Woods"
];
const questItems = [
  "(no phis)mil_reciv",
  "008_5_key",
  "009_1_nout",
  "009_2_doc",
  "010_4_flash",
  "010_5_drive",
  "206_water_06",
  "controller1_forest_crate",
  "controller_comp_room",
  "controller_wood_car",
  "diagset_Sanitar",
  "case_0060  [1] (3)",
  "case_0060  [1] (2)",
  "book_osnovu",
  "book_venskiy",
  "sas1",
  "sas2",
  "giroscope21",
  "giroscope23",
  "huntsman_001_message",
  "shop_goshan_vedodmost",
  "shop_idea_vedodmost",
  "shop_oli_vedodmost2",
  "shop_oli_vedodmost_part",
  "surgical_kit_Sanitar",
  "blood_probe",
  "quest"
]

for(let map in maps)
{
	console.log("MAP : " + maps[map].toLowerCase());
	let newLoot = {
		"forced": [],
		"mounted": [],
		"static": [],
		"dynamic": []
	}
  // THIS PART ADDS OLD LOOT LOCATIONS - so if new dumps doesnt have them you can add them like this
	/*const loadOldMapData = loadParsed(`./oldMaps/${maps[map].toLowerCase()}.json`);
	//for(const id in loadOldMapData.forced)
	//{
	//	newLoot.forced.push(GenerateForcedShort(loadOldMapData.forced[id]));
	//}
	for(const id in loadOldMapData.mounted)
	{
		newLoot.mounted.push(GenerateMountedShort(loadOldMapData.mounted[id]));
	}*/
  let LocationBase = {};
	for(let num = 1; num <= 10; num++)
	{
		fileType = (!fs.existsSync(`./maps/${maps[map]}${num}.txt`))?".json":".txt";
		//const mapDataLoot = loadParsed(`./maps/${maps[map]}${num}${fileType}`).Location.Loot; // old txt or bytes!!!!!
    if((fileType == ".txt" && fs.existsSync(`./maps/${maps[map]}${num}${fileType}`)) || fs.existsSync(`./maps/${maps[map]}_${num}${fileType}`)) {
      
      let mapDataLoot = (fileType == ".txt")?(loadParsed(`./maps/${maps[map]}${num}${fileType}`)):(loadParsed(`./maps/${maps[map]}_${num}${fileType}`)); // from dumps of ingame assets
      
      if(typeof mapDataLoot.data != "undefined"){
        mapDataLoot = mapDataLoot.data;
      }
      if(typeof mapDataLoot.Location != "undefined"){
        mapDataLoot = mapDataLoot.Location;
      }
      LocationBase = mapDataLoot;
      mapDataLoot = mapDataLoot.Loot;
      LocationBase.Loot = [];
      
      for(const loot in mapDataLoot)
      {
        if(mapDataLoot[loot].IsStatic)
        {
          if(newLoot.static.filter(item => item.id == mapDataLoot[loot].Id).length == 0)
            newLoot.static.push(GenerateStaticShort(mapDataLoot[loot]));
        } else 
        {
          let isQuest = false;
          for(let id in questItems){
            if(mapDataLoot[loot].Id.indexOf(questItems[id]) != -1){
              isQuest = true;
              break;
            }
          }
          if(questItemID.indexOf(mapDataLoot[loot].Items[0]._tpl) != -1){
            isQuest = true;
          }
          if(isQuest){
            if(newLoot.forced.filter(item => item.id == mapDataLoot[loot].Id).length == 0){
              console.log("QUEST SPAWN: " + mapDataLoot[loot].Id)
              newLoot.forced.push(GenerateForcedShort(mapDataLoot[loot]))
            }
          } else {
            if(newLoot.dynamic.filter(item => item.id == mapDataLoot[loot].Id).length == 0)
              newLoot.dynamic.push(GenerateDynamicShort(mapDataLoot[loot]));
          }
        }
      }
    }
	}
  
	console.log("Forced : " + newLoot.forced.length);
	console.log("Mounted : " + newLoot.mounted.length);
	console.log("Static : " + newLoot.static.length);
	console.log("Dynamic : " + newLoot.dynamic.length);
	console.log("");
	/*
	let count = 0;
		for(const _loot in oldLootMaps[maps[map].toLowerCase()].loot.dynamic)
		{
			const _lootData = oldLootMaps[maps[map].toLowerCase()].loot.dynamic[_loot];
			let found = false;
			for(const _new_loot in newLoot.dynamic){
				if(typeof newLoot.dynamic[_new_loot].Items == "undefined")
					continue;
				if(_lootData.id == newLoot.dynamic[_new_loot].id || 
				_lootData.data[0].Position == newLoot.dynamic[_new_loot].Position || 
				//_lootData.data[0].Items[0]._id == newLoot.dynamic[_new_loot].Items[0]._id || 
				_lootData.data[0].Items[0]._tpl == newLoot.dynamic[_new_loot].Items[0])
					found = true;
			}
			if (!found){
				//if(maps[map].toLowerCase() == "factory4_day")
				//	console.log(oldLootMaps[maps[map].toLowerCase()].loot.dynamic[_loot]);
				newLoot.dynamic.push(GenerateDynamicShort(oldLootMaps[maps[map].toLowerCase()].loot.dynamic[_loot]));
				count++;
			}
		}
		// check for static below
		console.log("Old Dynamic Loot Added : " + count);
		count = 0;
		for(const _loot in oldLootMaps[maps[map].toLowerCase()].loot.static)
		{
			const _lootdata = oldLootMaps[maps[map].toLowerCase()].loot.static[_loot];
			let found = false;
			for(const _new_loot in newLoot.static){
				if(_lootdata.id == newLoot.static[_new_loot].id || 
				_lootdata.Position == newLoot.static[_new_loot].Position || 
				_lootdata.Items[0]._id == newLoot.static[_new_loot].Items[0]._id || 
				_lootdata.Items[0]._tpl == newLoot.static[_new_loot].Items[0]._tpl)
					found = true;
			}
			if (!found){
				newLoot.static.push(GenerateStaticShort(oldLootMaps[maps[map].toLowerCase()].loot.static[_loot]));
				count++;
			}
		}
		console.log("Old Static Containers Added : " + count);
		*/
	fs.writeFileSync(`./newBase/${maps[map].toLowerCase()}.json`, JSON.stringify(LocationBase));
	fs.writeFileSync(`./new/${maps[map].toLowerCase()}.json`, JSON.stringify(newLoot));
}