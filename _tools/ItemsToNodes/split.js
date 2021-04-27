// Made by TheMaoci for creating node based files easier from items.json 
// splitting items.json into categorie files
// by "_name" inside type
"use strict";
const fs = require('fs');
function _checkDir(file) {    
    let filePath = file.substr(0, file.lastIndexOf('/'));

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
}
function _stringify(data) {
    return JSON.stringify(data, null, "\t");
}
function _parse(string) {
    return JSON.parse(string);
}
function _read(file) {
    return fs.readFileSync(file, 'utf8');
}
function _write(file, data) {
	if(file.indexOf("/") != -1)
		_checkDir(file); // if exist then there is a path to check
    fs.writeFileSync(file, _stringify(data), 'utf8');
}

var GlobalItems = _parse(_read("items.json"));
if(typeof GlobalItems['data'] != "undefined")
	GlobalItems = GlobalItems['data'];
var Nodes = [];
console.log("Starting splitting...");

// save nodes from items...
for (let item in GlobalItems){
	if(GlobalItems[item]['_type'] == "Node")
		Nodes.push(GlobalItems[item]);
}
let CachedItemsToSave = [];
let counter = 1;
console.log(`Size of Node's: ${Nodes.length}`);

for (var node of Nodes)
{
	CachedItemsToSave = [];
	if(node["_parent"] == "" && node["_name"] == "Item")
		CachedItemsToSave.push(GlobalItems["54009119af1c881c07000029"]);
	for(let item in GlobalItems)
	{
		if(GlobalItems[item]["_parent"] == node["_id"])
			CachedItemsToSave.push(GlobalItems[item]);
	}
	
	let countNumber = ( (counter < 10)?`00${counter}`:( (counter < 100)?`0${counter}`:counter ) );
	
	console.log(`Items_${node["_name"]}_${countNumber}.json >> Size: ${CachedItemsToSave.length}`);
	//Node_${countNumber}_
	_write(`Items/${node["_name"]}.json`, CachedItemsToSave);
	
	counter++;
}