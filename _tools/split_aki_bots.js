const fileIO = require('./fileIO.js')
let bot_folders = fileIO.readDir("./database/bots/types");

for(let folder in bot_folders){
	let folderName = bot_folders[folder].replace(".json", "");
	let data = fileIO.readParsed("./database/bots/types/" + bot_folders[folder] );
	for(let fileName in data){
		if(fileName == "difficulty")
		{
			fileIO.write("./database/bots/newTypes/" + folderName + "/difficulty/easy.json", data[fileName].easy);
			fileIO.write("./database/bots/newTypes/" + folderName + "/difficulty/normal.json", data[fileName].normal);
			fileIO.write("./database/bots/newTypes/" + folderName + "/difficulty/hard.json", data[fileName].hard);
			fileIO.write("./database/bots/newTypes/" + folderName + "/difficulty/impossible.json", data[fileName].impossible);
		} else {
			fileIO.write("./database/bots/newTypes/" + folderName + "/" + fileName + ".json", data[fileName]);
		}
	}
	
}