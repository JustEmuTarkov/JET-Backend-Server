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

function main(){
	let files = fs.readdirSync("./db/assort");
	for(let trader of files){
		
		let path0 = `./db/assort/${trader}`;
		let path1 = `./db/assort2/${trader}`;

		let p_barter_scheme = "barter_scheme";
		if(fs.existsSync(path0 + "/" + p_barter_scheme)){
			let files_barter_scheme = fs.readdirSync(path0 + "/" + p_barter_scheme);
			let db_barter_scheme = {};
			for(let file of files_barter_scheme)
			{
				db_barter_scheme[file.replace(".json","")] = _parse(_read(path0 + "/" + p_barter_scheme + "/" + file));
			}
			_write(`${path1}/${p_barter_scheme}.json`, db_barter_scheme);
		}
		let p_items = "items";
		if(fs.existsSync(path0 + "/" + p_items)){
			let files_items = fs.readdirSync(path0 + "/" + p_items);
			let db_items = [];
			for(let file of files_items)
			{
				db_items.push(_parse(_read(path0 + "/" + p_items + "/" + file)));
			}
			_write(`${path1}/${p_items}.json`, db_items);
		}
		let p_loyal_level_items = "loyal_level_items";
		if(fs.existsSync(path0 + "/" + p_loyal_level_items)){
			let files_loyal_level_items = fs.readdirSync(path0 + "/" + p_loyal_level_items);
			let db_loyal_level_items = {};
			for(let file of files_loyal_level_items)
			{
				db_loyal_level_items[file.replace(".json","")] = _parse(_read(path0 + "/" + p_loyal_level_items + "/" + file));
			}
			_write(`${path1}/${p_loyal_level_items}.json`, db_loyal_level_items);
		}
		let p_quests = "quests";
		if(fs.existsSync(path0 + "/" + p_quests)){
			let files_quests = fs.readdirSync(path0 + "/" + p_quests);
			let db_quests = {};
			for(let file of files_quests)
			{
				db_quests[file.replace(".json","")] = _parse(_read(path0 + "/" + p_quests + "/" + file));
			}
			_write(`${path1}/${p_quests}.json`, db_quests);
		}
		
		
	}
} main();