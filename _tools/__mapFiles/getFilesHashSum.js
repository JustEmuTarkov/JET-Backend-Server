const crypto = require('crypto');
const fs = require('fs');

// THIS FILE REQUIRES TO BE IN A FOLDER INSIDE BUILDED RELEASE as "__mapFiles" folder or whatever name you came to

const Root = "../"; // change this if you dont want to go back 1 directory for file mapping

const MainFolder = [
	"db",
	"res",
	"src",
	"user",
	"Server.exe",
]

function ReadDir(path){
	return fs.readdirSync(path)
}
function DeepSearch(RootPath){
	const path = RootPath + "/";
	const filesInFolder = ReadDir(RootPath);
	if(RootPath.includes("user/mods")) return;
	if(RootPath.includes("user/profiles")) return;
	for(const name_1 of filesInFolder){
		if(name_1 == "version") continue;
		if(name_1.includes(".")){
			const path_1 = path + name_1;
			const keyName = path_1.replace("../", "");
			const hashSum = crypto.createHash('sha256');
			console.log(path_1);
			const fileBuffer = fs.readFileSync(path_1);
			hashSum.update(fileBuffer);
			HashFileData[keyName] = hashSum.digest('hex');
		} else {
			DeepSearch(path + name_1);
		}
	}
}

let HashFileData = {};

for(const name of MainFolder){
	if(name.includes(".exe")){
		const fileBuffer = fs.readFileSync(Root + name);
		const hashSum = crypto.createHash('sha256');
		hashSum.update(fileBuffer);
		HashFileData[name] = hashSum.digest('hex');
	} else {
		DeepSearch(Root + name);
		// const path = Root + name + "/";
		// const filesInFolder = ReadDir(Root + name);
		// for(const name_1 of filesInFolder){
			// if(name_1.includes(".")){
				// const path_1 = path + name_1;
				// const keyName = path_1.replace("/", "_");
				// const hashSum = crypto.createHash('sha256');
				// hashSum.update(fileBuffer);
				// HashFileData[keyName] = hashSum.digest('hex');
			// }
		// }
	}
}
fs.writeFileSync("hashSum.json", JSON.stringify(HashFileData, null, "\t"));
//console.log(HashFileData);
