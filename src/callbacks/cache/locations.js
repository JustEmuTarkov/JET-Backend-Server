
function Create_ForcedDynamicStruct(item_data){
	let isStatic = false;
	let useGravity = false;
	let randomRotation = false;
	let position = {x:0,y:0,z:0};
	let rotation = {x:0,y:0,z:0};
	
	if(typeof item_data.IsStatic != "undefined")
		isStatic = item_data.IsStatic;
	if(typeof item_data.useGravity != "undefined")
		useGravity = item_data.useGravity;
	if(typeof item_data.randomRotation != "undefined")
		randomRotation = item_data.randomRotation;
	if(item_data.Position != 0)
	{
		position.x = item_data.Position[0];
		position.y = item_data.Position[1];
		position.z = item_data.Position[2];
	}
	if(item_data.Rotation != 0)
	{
		rotation.x = item_data.Rotation[0];
		rotation.y = item_data.Rotation[1];
		rotation.z = item_data.Rotation[2];
	}
	return {
		"id": item_data.id,
		"data": [
			{
				"Id": item_data.id,
				"IsStatic": isStatic,
				"useGravity": useGravity,
				"randomRotation": randomRotation,
				"Position": position,
				"Rotation": rotation,
				"IsGroupPosition": false,
				"GroupPositions": [],
				"Root": item_data.Items[0]._id,
				"Items": item_data.Items
			}
		]
	};
	return {
		"id": "loot_quest_letter1685434",
		"data": [
			{
				"Id": "loot_quest_letter1685434",
				"IsStatic": false,
				"useGravity": false,
				"randomRotation": false,
				"Position": {
					"x": -18.8457,
					"y": 0.6842,
					"z": 21.6351
				},
				"Rotation": {
					"x": 338.5508,
					"y": 18.1136837,
					"z": 80.98495
				},
				"IsGroupPosition": false,
				"GroupPositions": [],
				"Root": "5db5d02c533aa77c477a504a",
				"Items": [
					{
						"_id": "5db5d02c533aa77c477a504a",
						"_tpl": "591093bb86f7747caa7bb2ee"
					}
				]
			}
		]
	};
}
function Create_StaticMountedStruct(item_data){
	let isStatic = false;
	let useGravity = false;
	let randomRotation = false;
	let position = {x:0,y:0,z:0};
	let rotation = {x:0,y:0,z:0};
	
	if(typeof item_data.IsStatic != "undefined")
		isStatic = item_data.IsStatic;
	if(typeof item_data.useGravity != "undefined")
		useGravity = item_data.useGravity;
	if(typeof item_data.randomRotation != "undefined")
		randomRotation = item_data.randomRotation;
	if(item_data.Position != 0)
	{
		position.x = item_data.Position[0];
		position.y = item_data.Position[1];
		position.z = item_data.Position[2];
	}
	if(item_data.Rotation != 0)
	{
		rotation.x = item_data.Rotation[0];
		rotation.y = item_data.Rotation[1];
		rotation.z = item_data.Rotation[2];
	}
	return {
		"Id": item_data.id,
		"IsStatic": isStatic,
		"useGravity": useGravity,
		"randomRotation": randomRotation,
		"Position": position,
		"Rotation": rotation,
		"IsGroupPosition": false,
		"GroupPositions": [],
		"Root": item_data.Items[0]._id,
		"Items": item_data.Items
	};
}

exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }
	logger.logInfo("Caching: locations.json");
	let locations = {};
	for (let name in db.locations.base) {
		let _location = { "base": {}, "loot": {}};
		_location.base = fileIO.readParsed(db.locations.base[name]);
		_location.loot = {forced: [], mounted: [], static: [], dynamic: []};
		if(typeof db.locations.loot[name] != "undefined"){
			let loot_data = fileIO.readParsed(db.locations.loot[name]);
			for(let type in loot_data){
				for(item of loot_data[type]){
					if(type == "static" || type == "mounted"){
						_location.loot[type].push(Create_StaticMountedStruct(item))
						continue;
					}
					_location.loot[type].push(Create_ForcedDynamicStruct(item))
				}
			}
		}
		locations[name] = _location;
	}
	fileIO.write("user/cache/locations.json", locations);
}