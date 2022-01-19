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
var GlobalItems = _parse(_read("items_old.json"));
if(typeof GlobalItems['data'] != "undefined")
	GlobalItems = GlobalItems['data'];
var Nodes = [];
console.log("Starting...");

let minSpawnRate = 100;
let maxSpawnRate = 0
for (let item in GlobalItems){
  	if(typeof GlobalItems[item]['_props'].SpawnChance != "undefined")
    {
      if(GlobalItems[item]['_props'].SpawnChance > maxSpawnRate)
        maxSpawnRate = GlobalItems[item]['_props'].SpawnChance;
      if(GlobalItems[item]['_props'].SpawnChance < minSpawnRate)
        minSpawnRate = GlobalItems[item]['_props'].SpawnChance;
    }
}
console.log("minSpawnRate:"+minSpawnRate);
console.log("maxSpawnRate:"+maxSpawnRate);
GlobalItems = _parse(_read("items.json"));
if(typeof GlobalItems['data'] != "undefined")
	GlobalItems = GlobalItems['data'];

// save nodes from items...

let high_LootExperience = 0;
let high_ExamineExperience = 0;
let low_LootExperience = 999;
let low_ExamineExperience = 999;

let groupIt_LootExperience = {};
let groupIt_ExamineExperience = {};
for (let item in GlobalItems){
	if(typeof GlobalItems[item]['_props'].LootExperience != "undefined" && typeof GlobalItems[item]['_props'].ExamineExperience != "undefined")
  {
    if(GlobalItems[item]['_props'].LootExperience > high_LootExperience)
      high_LootExperience = GlobalItems[item]['_props'].LootExperience;
    if(GlobalItems[item]['_props'].LootExperience < low_LootExperience)
      low_LootExperience = GlobalItems[item]['_props'].LootExperience;
    if(GlobalItems[item]['_props'].ExamineExperience > high_ExamineExperience)
      high_ExamineExperience = GlobalItems[item]['_props'].ExamineExperience;
    if(GlobalItems[item]['_props'].ExamineExperience < low_ExamineExperience)
      low_ExamineExperience = GlobalItems[item]['_props'].ExamineExperience;
    
    if(typeof groupIt_LootExperience[GlobalItems[item]['_props'].LootExperience] == "undefined")
      groupIt_LootExperience[GlobalItems[item]['_props'].LootExperience] = 1;
    else
      groupIt_LootExperience[GlobalItems[item]['_props'].LootExperience] += 1;

    if(typeof groupIt_ExamineExperience[GlobalItems[item]['_props'].ExamineExperience] == "undefined")
      groupIt_ExamineExperience[GlobalItems[item]['_props'].ExamineExperience] = 1;
    else
      groupIt_ExamineExperience[GlobalItems[item]['_props'].ExamineExperience] += 1;
  }
}
console.log("high_LootExperience="+high_LootExperience);
console.log("high_ExamineExperience="+high_ExamineExperience);
console.log("low_LootExperience="+low_LootExperience);
console.log("low_ExamineExperience="+low_ExamineExperience);


console.log("LootExperience Table");
console.log(groupIt_LootExperience);
console.log("ExamineExperience Table");
console.log(groupIt_ExamineExperience);
