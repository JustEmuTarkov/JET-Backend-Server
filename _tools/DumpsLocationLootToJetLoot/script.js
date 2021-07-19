
const fs = require('fs');

function GenerateStaticShort(loot)
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
		"id": "",
		"Position": 0,
		"Rotation": 0,
		"Items": []
	}
	shorten.id = loot.Id;
	let loot_2 = loot;
	if(typeof loot.data != "undefined")
		loot_2 = loot.data[0];
	
	shorten.Items = loot_2.Items;
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
	if(loot_2.Position.x != "0" || loot_2.Position.y != "0" || loot_2.Position.z != "0"){
		shorten.Position = loot_2.Position;
	}
	if(loot_2.Rotation.x != "0" || loot_2.Rotation.y != "0" || loot_2.Rotation.z != "0"){
		shorten.Rotation = loot_2.Rotation;
	}
	return shorten;
}
function GenerateForcedShort(loot)
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
const oldLootMaps = loadParsed('./locations_old.json');
const maps = [
	"bigmap",
	"develop",
	"factory4_day",
	"factory4_night",
	"Interchange",
	"Laboratory",
	"RezervBase",
	"Shoreline",
	"Woods"
];

for(let map in maps)
{
	console.log("MAP : " + maps[map].toLowerCase());
	let newLoot = {
		"forced": [],
		"mounted": [],
		"static": [],
		"dynamic": []
	}
	const loadOldMapData = loadParsed(`./oldMaps/${maps[map].toLowerCase()}.json`);
	for(const id in loadOldMapData.forced)
	{
		newLoot.forced.push(GenerateForcedShort(loadOldMapData.forced[id]));
	}
	console.log("Forced : " + newLoot.forced.length);
	for(const id in loadOldMapData.mounted)
	{
		newLoot.mounted.push(GenerateMountedShort(loadOldMapData.mounted[id]));
	}
	console.log("Mounted : " + newLoot.mounted.length);
	for(let num = 1; num <= 6; num++)
	{
		fileType = (!fs.existsSync(`./maps/${maps[map]}${num}.bytes`))?".json":".bytes";
		const mapDataLoot = loadParsed(`./maps/${maps[map]}${num}${fileType}`).Location.Loot;

		for(const loot in mapDataLoot)
		{
			if(mapDataLoot[loot].IsStatic)
			{
				newLoot.static.push(GenerateStaticShort(mapDataLoot[loot]));
			} else 
			{
				newLoot.dynamic.push(GenerateDynamicShort(mapDataLoot[loot]));
			}
		}
	}
	console.log("Static : " + newLoot.static.length);
	console.log("Dynamic : " + newLoot.dynamic.length);
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
				_lootData.data[0].Items[0]._id == newLoot.dynamic[_new_loot].Items[0]._id || 
				_lootData.data[0].Items[0]._tpl == newLoot.dynamic[_new_loot].Items[0]._tpl)
					found = true;
			}
			if (!found){
				newLoot.dynamic.push(oldLootMaps[maps[map].toLowerCase()].loot.dynamic[_loot]);
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
				newLoot.dynamic.push(oldLootMaps[maps[map].toLowerCase()].loot.dynamic[_loot]);
				count++;
			}
		}
		console.log("Old Static Containers Added : " + count);
	fs.writeFileSync(`./${maps[map].toLowerCase()}.json`, JSON.stringify(newLoot));
}