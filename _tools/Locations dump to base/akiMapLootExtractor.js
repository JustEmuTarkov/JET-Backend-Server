const fileIO = require("./fileIO.js");

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
	shorten.id = loot.Id;
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


let read_dir = fileIO.readDir("locationsAki")


for(let map of read_dir)
{
  if(!fileIO.exist("./locationsAki/" + map + "/loot.json")) continue;
  let dataLoaded = fileIO.readParsed("./locationsAki/" + map + "/loot.json")
  console.log("-- -- -- -- -- -- --");
  console.log("MAP : " + map.toLowerCase());
	let newLoot = {
		"forced": [],
		"mounted": [],
		"static": [],
		"dynamic": []
	}
  
  for(let forced of dataLoaded.forced){
    newLoot.forced.push(GenerateForcedShort(forced.data[0]));
  }
  for(let mounted of dataLoaded.mounted){
    newLoot.mounted.push(GenerateMountedShort(mounted));
  }
  for(let static of dataLoaded.static){
    newLoot.static.push(GenerateStaticShort(static));
  }
  for(let dynamic of dataLoaded.dynamic){
    newLoot.dynamic.push(GenerateDynamicShort(dynamic.data[0]));
  }
  
let seen = []
let duplicates = []
for (let k in newLoot.forced) {
  let itemId = newLoot.forced[k].id
  if (seen.includes(itemId)) {
      duplicates.push(itemId)
      console.log("Duplicate forced: ID: " + itemId)
  } else {
      seen.push(itemId)
  }
}
console.log("Duplicated Forced: " + duplicates.length);

seen = []
duplicates = []
for (let k in newLoot.mounted) {
  let itemId = newLoot.mounted[k].id
  if (seen.includes(itemId)) {
      duplicates.push(itemId)
      console.log("Duplicate mounted: ID: " + itemId)
  } else {
      seen.push(itemId)
  }
}
console.log("Duplicated mounted: " + duplicates.length);

seen = []
duplicates = []
for (let k in newLoot.static) {
  let itemId = newLoot.static[k].id
  if (seen.includes(itemId)) {
      duplicates.push(itemId);
      console.log("Duplicate static: ID: " + itemId)
  } else {
      seen.push(itemId)
  }
}
console.log("Duplicated static: " + duplicates.length);

seen = []
duplicates = []
for (let k in newLoot.dynamic) {
  let itemId = newLoot.dynamic[k].id
  if (seen.includes(itemId)) {
      duplicates.push(itemId)
      console.log("Duplicate dynamic: ID: " + itemId)
  } else {
      seen.push(itemId)
  }
}
console.log("Duplicated dynamic: " + duplicates.length);


  console.log("-- TOTAL --");
  console.log("forced: " + newLoot.forced.length);
  console.log("mounted: " + newLoot.mounted.length);
  console.log("static: " + newLoot.static.length);
  console.log("dynamic: " + newLoot.dynamic.length);
  fileIO.write(`./convertedLocations/${map.toLowerCase()}.json`, newLoot);
}