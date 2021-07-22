
function Create_ForcedDynamicStruct(item_data){
	let isStatic = false;
	let useGravity = false;
	let randomRotation = false;
	let position = {x:0,y:0,z:0};
	let rotation = {x:0,y:0,z:0};
	let IsGroupPosition = false;
	let GroupPositions = [];
	
	if(typeof item_data.IsStatic != "undefined")
		isStatic = item_data.IsStatic;
	if(typeof item_data.useGravity != "undefined")
		useGravity = item_data.useGravity;
	if(typeof item_data.randomRotation != "undefined")
		randomRotation = item_data.randomRotation;

	if(item_data.Position != 0 && item_data.Position != "0")
	{
		position.x = item_data.Position.x;
		position.y = item_data.Position.y;
		position.z = item_data.Position.z;
	}
	if(item_data.Rotation != 0 && item_data.Rotation != "0")
	{
		rotation.x = item_data.Rotation.x;
		rotation.y = item_data.Rotation.y;
		rotation.z = item_data.Rotation.z;
	}
	if(typeof item_data.IsGroupPosition != "undefined"){
		IsGroupPosition = item_data.IsGroupPosition;
		GroupPositions = item_data.GroupPositions;
	}

	return {
		"Id": item_data.id,
		"IsStatic": isStatic,
		"useGravity": useGravity,
		"randomRotation": randomRotation,
		"Position": position,
		"Rotation": rotation,
		"IsGroupPosition": IsGroupPosition,
		"GroupPositions": GroupPositions,
		"Items": item_data.Items
	};
}
function Create_StaticMountedStruct(item_data){
	let isStatic = false;
	let useGravity = false;
	let randomRotation = false;
	let position = {x:0,y:0,z:0};
	let rotation = {x:0,y:0,z:0};
	let IsGroupPosition = false;
	let GroupPositions = [];
	
	if(typeof item_data.IsStatic != "undefined")
		isStatic = item_data.IsStatic;
	if(typeof item_data.useGravity != "undefined")
		useGravity = item_data.useGravity;
	if(typeof item_data.randomRotation != "undefined")
		randomRotation = item_data.randomRotation;
	if(item_data.Position != 0 && item_data.Position != "0")
	{
		position.x = item_data.Position.x;
		position.y = item_data.Position.y;
		position.z = item_data.Position.z;
	}
	if(item_data.Rotation != 0 && item_data.Rotation != "0")
	{
		rotation.x = item_data.Rotation.x;
		rotation.y = item_data.Rotation.y;
		rotation.z = item_data.Rotation.z;
	}
	if(typeof item_data.IsGroupPosition != "undefined"){
		IsGroupPosition = item_data.IsGroupPosition;
		GroupPositions = item_data.GroupPositions;
	}
	return {
		"Id": item_data.id,
		"IsStatic": isStatic,
		"useGravity": useGravity,
		"randomRotation": randomRotation,
		"Position": position,
		"Rotation": rotation,
		"IsGroupPosition": IsGroupPosition,
		"GroupPositions": GroupPositions,
		"Root": item_data.Items[0]._id, // id of container
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
	fileIO.write("user/cache/locations.json", locations, true, false);
}