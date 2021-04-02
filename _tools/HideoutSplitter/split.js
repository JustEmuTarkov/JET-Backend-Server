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

var Areas = _parse(_read("areas.json"));
var Production = _parse(_read("production.json"));
var ScavCase = _parse(_read("scavcase.json"));


for(let area of Areas){
	_write("./areas/" + area._id + ".json" , area);
}
for(let production of Production){
	_write("./production/" + production._id + ".json" , production);
}
for(let scavcase of ScavCase){
	_write("./scavcase/" + scavcase._id + ".json" , scavcase);
}