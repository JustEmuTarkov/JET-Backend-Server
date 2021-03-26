const fileIO = require("./fileIO.js");

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
	for(let inputName of inputFileName){
		let path = `./traders/${trader}/assort/${inputName}.json`;
		dataStruct[inputName] = fileIO.readParsed(path);
	
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
	fileIO.write(`./traders/${trader}/assort.json`, outputStruct, false, false);
}
console.log("Finished !!");