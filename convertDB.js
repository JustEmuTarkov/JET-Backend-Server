"use strict";
const fs = require('fs-extra');
const path = require('path');

var dbFolder = "./db";
var new_dbFolder = "./dbConverted";

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
function _simpleCopyEverything(folderName){
	_copyFolderRecursiveSync(
		`${dbFolder}/${folderName}/`, 
		`${new_dbFolder}/${folderName}/`
	);
}
function _copyFileSync( source, target ) {
	_checkDir(target);
    var targetFile = target;
    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) )
        if ( fs.lstatSync( target ).isDirectory() )
            targetFile = path.join( target, path.basename( source ) );
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}
function _copyFolderRecursiveSync( source, target ) {
    fs.copy(source, target, function (err) {
	  if (err) {
		console.error(err);
	  }
	});
}

var dbFolders = ['bots','dialogues','match','profile', 'customization','hideout','items','locales','locations','ragfair','templates','weather','assort', 'traders'];

//makesure new dir is created
if (!fs.existsSync(new_dbFolder)) {
    fs.mkdirSync(new_dbFolder, { recursive: true });
}

// yes its writen horribly but it must works and doesnt require alot of work to be done so, if you willing to rewrite this shit, have my blessing!!
async function main(){
		if(!fs.existsSync(`${dbFolder}/globals.json`)){
			_copyFileSync(`${dbFolder}/globals.json`,`${new_dbFolder}/globals.json`);
			console.log("Copied Globals.json");
		}
	for (let folderName of dbFolders){
		if(folderName != "traders")
			if(!fs.existsSync(`${dbFolder}/${folderName}`)){
				console.log(`Folder: ${folderName} not exist skipping`)
				continue;
			}

		switch(folderName){
			case "customization":
			case "hideout":
			case "weather":
			case "templates":
			case "locations":
			case "ragfair":
			case "dialogues":
			case "match":
			case "profile":
				_simpleCopyEverything(folderName);
				console.log(`Generated ${folderName}`);
				break;
			case "bots": 
				let toCopy_bots = ['base.json','core.json'];
				let foldersInsideBotToCopy = ['difficulties','inventory'];
				let botsFolders = fs.readdirSync(`${dbFolder}/bots`);
				for(let file of toCopy_bots){
					_copyFileSync( `${dbFolder}/bots/${file}`, `${new_dbFolder}/bots/${file}` );
				}
				for(let folder of botsFolders){
					if(folder.indexOf(".json") != -1) continue;
					// APPERANCE SECTION
					let appearancePath = `${dbFolder}/bots/${folder}/appearance`;
					let appearance_files = fs.readdirSync(appearancePath);
					let appearance_base = {"body":[],"feet":[],"hands":[],"head":[],"voice":[]};
					for(let appearance of appearance_files){
						// we looping through folders now
						let sub_items = fs.readdirSync(`${appearancePath}/${appearance}`);
						for(let item of sub_items){
							appearance_base[appearance].push(item); // cause we need only ID's
						}
					}
					_write(`${new_dbFolder}/bots/${folder}/appearance.json`, appearance_base);
					
					// EXPERIENCE SECTION
					let experiencePath = `${dbFolder}/bots/${folder}/experience`;
					let experience_files = fs.readdirSync(experiencePath);
					let experiance_base = [];
					for(let experience of experience_files){
						experiance_base.push(_read(`${experiencePath}/${experience}`));
					}
					_write(`${new_dbFolder}/bots/${folder}/experience.json`, experiance_base);
					
					// NAMES SECTION
					let namesPath = `${dbFolder}/bots/${folder}/names`;
					let names_files = fs.readdirSync(namesPath);
					let names_base = [];
					for(let names of names_files){
						names_base.push(_read(`${namesPath}/${names}`).replace('"','').replace('"',''));
					}
					_write(`${new_dbFolder}/bots/${folder}/names.json`, names_base);
					
					// DIFFICULTIES SECTION
					if(fs.existsSync(`${dbFolder}/bots/${folder}/difficulties`))
					{
						// not for ${folder} == "bear" or "usec"
						_copyFolderRecursiveSync(
							`${dbFolder}/bots/${folder}/difficulties`, 
							`${new_dbFolder}/bots/${folder}/difficulties`
							);
					}
					
					// INVENTORY SECTION
					_copyFolderRecursiveSync(
						`${dbFolder}/bots/${folder}/inventory`, 
						`${new_dbFolder}/bots/${folder}/inventory`
						);
					
					// HEALTH SECTION
					let health_data = _parse(_read(`${dbFolder}/bots/${folder}/health/default.json`));
					let newHealthBase = {"Hydration":0,"Energy":0,"BodyParts":{"Head":0,"Chest":0,"Stomach":0,"LeftArm":0,"RightArm":0,"LeftLeg":0,"RightLeg":0}};
					newHealthBase.Hydration = health_data.Hydration.Current;
					newHealthBase.Energy = health_data.Energy.Current;
					for(let bodyPart in health_data.BodyParts){
						newHealthBase.BodyParts[bodyPart] = health_data.BodyParts[bodyPart].Health.Current;
					}
					_write(`${new_dbFolder}/bots/${folder}/health/default.json`, newHealthBase);
					console.log(`Generated bot - ${folder}`);
				}
				console.log(`Generated ${folderName}`);
				// health need to be reworked liek load default.json and override it with the new default.json
				// appearance/experience/names need to be concated
			break;
			case "traders":
				// this is made from copying base and category from assorts...
				//loop through assort folders and copy 
				let toCopy_traders = ['base.json', 'categories.json'];
				
				let path_traders = `${dbFolder}/assort`;
				let new_path_traders = `${new_dbFolder}/traders`;
				let assortFolders = fs.readdirSync(path_traders);
				for(let folder of assortFolders){
					let traderpath = `${path_traders}/${folder}/`;
					let new_traderpath = `${new_path_traders}/${folder}/`;
					for(let file of toCopy_traders){
						_copyFileSync(`${traderpath}${file}`,`${new_traderpath}${file}`);
					}
				}
				console.log(`Generated ${folderName}`);
			break;
			case "assort": 
				// copy strict
				let toCopy_assort = ['quests', 'loyal_level_items', 'items', 'barter_scheme', 'questassort.json'];
				let path_assort = `${dbFolder}/assort/`;
				let new_path_assort = `${new_dbFolder}/assort/`;
				//if not exest jsut skip...
				for(let folder of toCopy_assort){
					let tradersList = fs.readdirSync(path_assort);
					for(let trader of tradersList){
						if(folder == "questassort.json"){
							if(fs.existsSync(`${path_assort}${trader}/questassort.json`)){
								_copyFileSync(`${path_assort}${trader}/questassort.json`,`${new_path_assort}${trader}/questassort.json`);
								continue;
							}
						}
						if(fs.existsSync(`${path_assort}${trader}/${folder}/`)){
							_copyFolderRecursiveSync(
								`${path_assort}${trader}/${folder}/`, 
								`${new_path_assort}${trader}/${folder}/`
							);
						}
					}
				}
				console.log(`Generated ${folderName}`);
			break;
			case "items": 
				let items_list = {};
				let Nodes = [];
				let path_items = `${dbFolder}/items`;
				let new_path_items = `${new_dbFolder}/items`;
				let folderFiles = fs.readdirSync(path_items);
				let CachedItemsToSave = [];
				for(let file of folderFiles)
				{
					let readData = _parse(_read(`${path_items}/${file}`));
					items_list[readData._id] = readData;
				}
				for (let item in items_list){
					if(items_list[item]['_type'] == "Node")
						Nodes.push(items_list[item]);
				}
				
				let counter = 1;
				for (var node of Nodes)
				{
					CachedItemsToSave = [];
					if(node["_parent"] == "" && node["_name"] == "Item")
						CachedItemsToSave.push(items_list["54009119af1c881c07000029"]);
					for(let item in items_list)
					{
						if(items_list[item]["_parent"] == node["_id"])
							CachedItemsToSave.push(items_list[item]);
					}
					
					let countNumber = ( (counter < 10)?`00${counter}`:( (counter < 100)?`0${counter}`:counter ) );
					
					//console.log(`${node["_name"]}_${countNumber}.json >> Size: ${CachedItemsToSave.length}`);
					
					_write(`${new_path_items}/Node_${countNumber}_${node["_name"]}.json`, CachedItemsToSave);
					
					counter++;
				}
				console.log(`Generated Item Nodes : ${counter-1}`);
				//add all items from retarded server to array
				//create nodes out of it and save them
			break;
			case "locales": 
				let path_locales = `${dbFolder}/locales`;
				let new_path_locales = `${new_dbFolder}/locales`;
				
				let files = fs.readdirSync(path_locales);
						for(let language of files){ // language folders aka en fr de ru etc.
							if(language.length > 5) continue;
							var path0 = `${path_locales}/${language}`;
							var path1 = `${new_path_locales}/${language}`;
							let files0 = fs.readdirSync(path0);
							for(let file of files0){ // insides of en, de, fr folders
								if(file.indexOf(".json") != -1)
								{ // language_file/menu/interface/error json
									_copyFileSync(`${path0}/${file}`,`${path1}/${file}`);
									continue;
								}
								//console.log(" -" + file);
								var dir = `${path0}/${file}`;
								let folderFiles = fs.readdirSync(dir);
								let data = {}
								let count = 0;
								for(let file0 of folderFiles){ // actual content for sub folders like locations/templates/trading etc.
									if(file0.indexOf(".json") != -1){
										data[file0.replace('.json','')] = _parse(_read(`${dir}/${file0}`));
									}
								}
								_write(`${path1}/_${file}.json`, data);
							}
						}
				console.log(`Generated ${folderName}`);
				//and folders need to be converted to _folderName.json
			break;
		}
	}
	console.log("Finalizing CopyFile Actions... Please Wait till program finishes.")
}

main();
