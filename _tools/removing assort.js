

// USE THIS TOOL IN ROOT DIRECTORY OF SERVER - SERVER MUST HAVE CACHE AND DB DATA

const fs = require("fs");
function createDir(file) {    
    let filePath = file.substr(0, file.lastIndexOf('/'));

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
}
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
let save_in_one_line = false;
let traderId = "579dc571d53a0658a154fbec";
let categories = [
	"5c164d2286f774194c5e69fa", // Keycard
	"5c99f98d86f7745c314214b3", // KeyMechanical
	"5448eb774bdc2d0a728b4567", // Barter item
];

let itemsData = require("./user/cache/items.json");
if(typeof itemsData.data != "undefined")
	itemsData = itemsData.data;
let traderAssortData = require("./db/traders/" + traderId + "/assort.json");
let new_Assort = {};

for(let itemId in traderAssortData){
	let Item = traderAssortData[itemId];
	
	// checks if categories array contains an parent of current item from assort
	// categories.indexOf("text to search")
	// != -1 -> if it found anything
	// Item.items[0]._tpl -> assort item _tpl
	// itemsData[Item.items[0]._tpl]._parent -> how to get parent id of item by its _tpl
	if(categories.indexOf(itemsData[Item.items[0]._tpl]._parent) != -1){
		// item is matching criteria
		new_Assort[itemId] = Item;
	}
}

write("./db/traders/" + traderId + "/assort_new.json", new_Assort);




