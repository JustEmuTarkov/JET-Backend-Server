exports.execute = (url, info, sessionID) => {
	//let ids = fileIO.readDir("user/profiles").filter(x => x != sessionID && x.startsWith("AID"));
	//let users = [];
	//for(let i in ids){
	//	let id = ids[i];
	//	if(!fileIO.exist(`user/profiles/${id}/character.json`)) continue;
	//	let character = fileIO.readParsed(`user/profiles/${id}/character.json`);
	//	if(!character.Info.Nickname || !character.Info.Nickname.toLowerCase().includes(info.nickname.toLowerCase())) continue;
	//	let obj = {_info: {}};
	//	obj._id = character.aid;
	//	obj._info.Nickname = character.Info.Nickname;
	//	obj._info.Side = character.Info.Side;
	//	obj._info.Level = character.Info.Level;
	//	obj._info.MemberCategory = ["Default"];
	//	obj._info.ignored = false;
	//	obj._info.banned = false;
	//	users.push(obj);
	//}
	//console.log(users);
	
	return response_f.getBody([]);
}