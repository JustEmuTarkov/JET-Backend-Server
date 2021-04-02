// Made by TheMaoci
// splitting hideout data into separate files
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
function readDir(path) { return fs.readdirSync(path); }

let languages = readDir("./global");
let languageType = require("./languages.json");


for(let lang of languages){
	let name = lang.replace(".json", "");
	let loadLocale = require("./global/" + lang);
	for(let subCat in loadLocale){
		_write("./newLocale/" + name + "/" + subCat + ".json", loadLocale[subCat]);
	}
	let loadMenu = require("./menu/" + lang);
	_write("./newLocale/" + name + "/menu.json", loadMenu);
	
	for(let type in languageType){
		if(languageType[type].ShortName == name){
			_write("./newLocale/" + name + "/" + name + ".json", languageType[type]);
			break;
		}
	}
}
