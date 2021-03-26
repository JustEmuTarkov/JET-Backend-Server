const fileIO = require("./fileIO.js");

let locations = fileIO.readDir("./locations");

for(let loc of locations){
	
	let path = `./locations/${loc}`;
	let data = fileIO.readParsed(path);
	
	if(typeof data.base != "undefined")
		fileIO.write(`./locations/base_${loc}`, data.base, false, false);
	if(typeof data.loot != "undefined")
		fileIO.write(`./locations/loot_${loc}`, data.loot, false, false);

}
console.log("Finished !!");