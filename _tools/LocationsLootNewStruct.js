const fs = require('fs');

/*
forced + dynamic
{
	"id": "loot_quest_letter1685434",
	"data": [
		{
			"Id": "loot_quest_letter1685434",
			"IsStatic": false,
			"useGravity": false,
			"randomRotation": false,
			"Position": {
				"x": -18.8457,
				"y": 0.6842,
				"z": 21.6351
			},
			"Rotation": {
				"x": 338.5508,
				"y": 18.1136837,
				"z": 80.98495
			},
			"IsGroupPosition": false,
			"GroupPositions": [],
			"Root": "5db5d02c533aa77c477a504a",
			"Items": [
				{
					"_id": "5db5d02c533aa77c477a504a",
					"_tpl": "591093bb86f7747caa7bb2ee"
				}
			]
		}
	]
}
static + mounted
{
	"Id": "Lootable_00026",
	"IsStatic": true,
	"useGravity": true,
	"randomRotation": false,
	"Position": {
		"x": 0,
		"y": 0,
		"z": 0
	},
	"Rotation": {
		"x": 0,
		"y": 0,
		"z": 0
	},
	"IsGroupPosition": false,
	"GroupPositions": [],
	"Root": "5db5d02c533aa77c477a5067",
	"Items": [
		{
			"_id": "5db5d02c533aa77c477a5067",
			"_tpl": "578f8778245977358849a9b5"
		}
	]
}

*/




function createDir(file) {    
    let filePath = file.substr(0, file.lastIndexOf('/'));

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
}
function read(file) { return fs.readFileSync(file, 'utf8'); }
function readParsed(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function write(file, data, raw = false) {
	if(file.indexOf('/') != -1)
		createDir(file);
	if(raw)
	{
        fs.writeFileSync(file, JSON.stringify(data));
        return;
	}
    fs.writeFileSync(file, JSON.stringify(data, null, "\t"), 'utf8');
    return;
}
function readDir(path) { return fs.readdirSync(path); }

let getFiles = readDir("./");

function NewStruct(LootID, Position, Rotation, Items, IsStatic, UseGravity, RandomRotation){
	let _pos = [], _rot = [];
	_pos.push(Position.x);
	_pos.push(Position.y);
	_pos.push(Position.z);
	_rot.push(Rotation.x);
	_rot.push(Rotation.y);
	_rot.push(Rotation.z);
	if(_pos[0] == 0 && _pos[1] == 0 && _pos[2] == 0)
		_pos = 0;
	if(_rot[0] == 0 && _rot[1] == 0 && _rot[2] == 0)
		_rot = 0;
	return {
			"id": LootID,
			"IsStatic": IsStatic,
			"useGravity": UseGravity,
			"randomRotation": RandomRotation,
			"Position": _pos,
			"Rotation": _rot,
			"Items": Items
		};
}

for(let file of getFiles){
	if(file.includes("_") || file == "new")
		continue;
	let _newStruct = {forced: [], mounted: [], static: [], dynamic: []};
	let data = readParsed("./" + file);
	
	for(let type in data){
		for(item of data[type]){
			if(type == "static" || type == "mounted"){
				_newStruct[type].push(
				NewStruct(
					item.Id, 
					item.Position, 
					item.Rotation,
					item.Items, 
					item.IsStatic, 
					item.useGravity, 
					item.randomRotation)
					);
				continue;
			}
			_newStruct[type].push(
				NewStruct(
					item.id, 
					item.data[0].Position, 
					item.data[0].Rotation,
					item.data[0].Items, 
					item.data[0].IsStatic, 
					item.data[0].useGravity, 
					item.data[0].randomRotation)
					);
		}
	}
	write("./new/" + file, _newStruct);
}
write