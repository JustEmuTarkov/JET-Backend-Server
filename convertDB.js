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

var dbFolder = "./db";
var new_dbFolder = "./dbConverted";

var dbFolders = ['bots','dialogues','match','profile','traders', 'customization','hideout','items','locales','locations','ragfair','templates','weather'];

//makesure new dir is created
if (!fs.existsSync(new_dbFolder)) {
        fs.mkdirSync(new_dbFolder, { recursive: true });
}

function main(){
	for (let folderName of dbFolders){
		
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
				simpleCopyEverything(folderName);
				break;
			case "bots": 
				let toCopy = ['base.json','core.json'];
				let foldersInsideBotToCopy = ['difficulties','inventory'];
				// health need to be reworked liek load default.json and override it with the new default.json
				// appearance/experience/names need to be concated
			break;
			case "traders":
				// this is made from copying base and category from assorts...
				//loop through assort folders and copy 
				let toCopy = ['base.json', 'categories.json']
			break;
			case "assort": 
				// copy strict
				let toCopy = ['quests', 'loyal_level_items', 'items', 'barter_scheme', 'questassort.json'];
				//if not exest jsut skip...
				
			break;
			case "items": 
				//add all items from retarded server to array
				//create nodes out of it and save them
			break;
			case "locales": 
				let filesToCopy = ['menu', 'interface', 'error']; // also language folder name.json
				let path = `${dbFolder}/locale`;
				DONT_FUCKING_RUN_IT_ITS_STILL_IN_PROGRESS
				let folders // INPROGRESS
				fs.writeFileSync(targetFile, fs.readFileSync(source));
				//and folders need to be converted to _folderName.json
			break;
		}
	}
}

function simpleCopyEverything(folderName){
	copyFolderRecursiveSync(
		`${dbFolder}/${folderName}`, 
		`${new_dbFolder}/${folderName}`
	);
	console.log(`[COPY]: finished for ${folderName}`)
}

function copyFileSync( source, target ) {
    var targetFile = target;
    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) )
        if ( fs.lstatSync( target ).isDirectory() )
            targetFile = path.join( target, path.basename( source ) );
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}
function copyFolderRecursiveSync( source, target ) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) )
        fs.mkdirSync( targetFolder );
    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}