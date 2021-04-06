

let profileQuests = require("./profile_quests.json");
let allQuests = require("./quests.json");
let questsDone = [];
for(let _obj of allQuests){
	for(let _pQ of profileQuests){
		//console.log(_obj._id + " " + _pQ.qid)
		if(_obj._id == _pQ.qid)
			questsDone.push(_pQ.qid);
	}
}
let questsNotFinished = [];
for(let _obj of allQuests){
	if(questsDone.indexOf(_obj._id) == -1){
		questsNotFinished.push(_obj._id);
	}
}

console.log("Finished:");
console.log(questsDone.length);
console.log("UnFinished:");
console.log(questsNotFinished.length);
console.log(questsNotFinished);