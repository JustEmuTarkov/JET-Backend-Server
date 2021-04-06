const fileIO = require("./fileIO.js");
const { v4: uuidv4 } = require('uuid')

var usingDumps = true;

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

let traderIDs = fileIO.readDir("./traders");
let outputFileName = "assort.json";
let inputFileName = ["barter_scheme", "items", "loyal_level_items"];
var itemToAddList = [];
function getDeepthItems(idToSearch, itemList){
	let nextToFind = [];
	for(item of itemList){
		if(item._id == idToSearch)
		{
			itemToAddList.push(item);
		}
		if(item.parentId == idToSearch)
		{
			getDeepthItems(item._id, itemList);
		}
	}
}


for(let trader of traderIDs){
	let dataStruct = {"barter_scheme": {}, "items": {}, "loyal_level_items": {}};
	let outputStruct = {};
	if(usingDumps){
		dataStruct = fileIO.readParsed(`./traders_new/${trader}/assort.json`);
	} else {
		for(let inputName of inputFileName){
			let path = `./traders/${trader}/assort/${inputName}.json`;
			dataStruct[inputName] = fileIO.readParsed(path);
		}
	}
	for(let itemId in dataStruct["loyal_level_items"]){
		outputStruct[itemId] = {
			"loyality": dataStruct["loyal_level_items"][itemId],
			"barter_scheme": dataStruct["barter_scheme"][itemId],
			"items": []
		}
		itemToAddList = [];// clear list before (incase)
		getDeepthItems(itemId, dataStruct["items"]);
		outputStruct[itemId]["items"] = itemToAddList;
		itemToAddList = [];// clear list after
	}
	if(usingDumps){
		fileIO.write(`./traders_concat/${trader}/assort.json`, outputStruct, false, false);
	} else {
		fileIO.write(`./traders/${trader}/assort.json`, outputStruct, false, false);
	}
}
console.log("Finished !!");