function DetectInput(data, name){
	if(data == "true" || data == "false" || data == true || data == false)
		return "<select name='" + name + "'><option value='true'>true</option><option value='false'>false</option></select>";
	if(typeof data === "string")
		return "<input size='10' name='" + name + "' value='" + data + "'/>"
	if(typeof data === "number")
		return "<input size='10' name='" + name + "' value='" + data + "'/>";
	/*if(typeof data === "object"){
		let html = "<select name='" + name + "'>";
		for(let item in data){
			html += "<option value='" + data[item] + "'>" + data[item] + "</option>";
		}
		html += "</select>";
		return html;
	}*/
	return data;
}

module.exports.renderPage = () => {
	// loads data
	let data = json.readParsed(db.user.configs.gameplay);
	// render page
	'<div class="container"><div class="row">'
	
	
	let html = "<form action='/' method='post'>";
	for(let category in data){
		html += '<div class="four columns"><table width="100%"><tr><td><h2>' + category + '</h2></td></tr>';
		for (let sub in data[category])
		{
			if(typeof data[category][sub] == "object"){
				html += "<tr><td colspan=2><h3>" + sub + "</h3></td></tr>";
				for(let subSub in data[category][sub])
				{
					html += "<tr><td class='right'>" + subSub + "</td><td>" + DetectInput(data[category][sub][subSub],subSub) + "</td></tr>";
				}
			} else {
				html += "<tr><td class='right'>" + sub + "</td><td>" + DetectInput(data[category][sub],sub) + "</td></tr>";
			}
		}
		html += "</table></div>"
	}
	html += '</div><div class="row"><div class="twelve columns"><button type="submit"> Save </button></div></form></div></div>';
	
	let content = '<html><head><title>JustEmuTarkov</title><link rel="stylesheet" id="style" href="style.css" type="text/css" media="all"><style>h2{font-size:16px;padding:3px 0 0 10px;margin:0;} h3{font-size:14px;padding:3px 0 0 15px;margin:0;} p{font-size:12px;padding:3px 0 0 25px;margin:0;} body{color:#fff;background:#000} table{border-bottom:1px solid #aaa;} .right{text-align:right;}</style></head><body>'+html+'</body></html>';

	return content;
	
}
function OutputConvert(data){
	// its not nececerly needed but its ok.
	if(typeof data === "string")
		return data;
	if(typeof data === "boolean")
		return !!JSON.parse(String(data).toLowerCase());
	if(typeof data === "number"){
		let _test = parseInt(data, 10);
		if(parseFloat(data) - _test > 0){
			return parseFloat(data);
		}
		return _test;
	}
	
}
module.exports.processSaveData = (data) => {
	if(data == "") return;
	console.log("I will save data here!!");
	let _data = json.readParsed(db.user.configs.gameplay);
	for(let category in _data)
	{
		for (let sub in _data[category])
		{
			if(typeof _data[category][sub] == "object"){
				for(let subSub in _data[category][sub])
				{
					
					_data[category][sub][subSub] = OutputConvert(data[subSub]);
				}
			} else {
				//console.log(sub);
				_data[category][sub] = OutputConvert(data[sub]);
			}
		}
	}

	console.log(_data);
	
}