const fileIO = require("./fileIO.js");

let locationsDump = fileIO.readParsed("./dump.json");
let locations = locationsDump.data.locations;

for(let loc in locations){
	var name = locations[loc].Name.toLowerCase();
	if(name == "factory" ){
		if(locations[loc].Enabled)
			name = "factory4_day";
		else
			name = "factory4_night";
	}
	let path = `./locations/${name}.json`;
	fileIO.write(path, locations[loc], false, false);

}
console.log("Finished !!");