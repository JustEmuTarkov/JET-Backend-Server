// Made by TheMaoci for creating quests from given quest.json file from aki
// 
// 
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

var quests_data = _parse(_read("./quests.json"));
var newQuestData = [];
for(let quest in quests_data)
{
  delete quests_data[quest].QuestName;
  newQuestData.push(quests_data[quest]);
}
_write("./quests_fixed.json", newQuestData);