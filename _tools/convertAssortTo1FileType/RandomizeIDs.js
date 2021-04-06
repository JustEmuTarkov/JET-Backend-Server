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
const { v4: uuidv4 } = require('uuid')

function generateNewId(prefix = "", useOld = false) {
	let retVal = ""
	if(useOld){
		let getTime = new Date();
		retVal = prefix
		retVal += getTime.getMonth().toString();
		retVal += getTime.getDate().toString();
		retVal += getTime.getHours().toString();
		retVal += (parseInt(getTime.getMinutes()) + parseInt(getTime.getSeconds())).toString();
		retVal += this.getRandomInt(1000000, 9999999).toString();
		retVal += this.makeSign(24 - retVal.length).toString();
	} else {
		retVal = `${prefix}-${uuidv4()}`;
	}
    return retVal;
}
function makeSign(Length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    
    for (let i = 0; i < Length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}
function getRandomInt(min = 0, max = 100) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (max > min) ? Math.floor(Math.random() * (max - min + 1) + min) : min;
}

var folders = fs.readdirSync("./traders");
for(let folder in folders){
	if(folders[folder].indexOf(".") != -1) continue;
	
	
	var __data = _parse(_read("./traders/" + folders[folder] + "/assort.json"));
	
	console.log(folders[folder]);
	if(typeof __data.items != undefined && folders[folder] != "579dc571d53a0658a154fbec" && folders[folder] != "ragfair"){
		for(let _object of __data.items){
			if(_object["parentId"] != "hideout" || _object["slotId"] != "hideout"){ 
				let Old_ID = _object["_id"];
				let New_ID = generateNewId("T");
				
				for(let _object_2 of __data.items){
					if(Old_ID == _object_2["parentId"])
						_object_2["parentId"] = New_ID;
				}
				_object["_id"] = New_ID;
				continue;
			}
			let Old_ID = _object["_id"];
			let New_ID = generateNewId("T");
			
			for(let _object_2 of __data.items){
				if(_object_2["parentId"] == "hideout") continue;
				if(_object_2["slotId"] == "hideout") continue;
				if(Old_ID == _object_2["parentId"])
					_object_2["parentId"] = New_ID;
			}
			_object["_id"] = New_ID;
			delete Object.assign(__data.barter_scheme, {
				[New_ID]: __data.barter_scheme[Old_ID] 
				})[Old_ID];
			delete Object.assign(__data.loyal_level_items, {
				[New_ID]: __data.loyal_level_items[Old_ID] 
				})[Old_ID];
		}
		_write("./traders_new/" + folders[folder] + "/assort.json", __data);
	}
	//_write("./traders_new/" + folders[folder] + "/items_2.json", items);
	//_write("./traders_new/" + folders[folder] + "/loyal_level_items_2.json", loyal_level_items);
}