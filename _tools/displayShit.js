let globals = require('./db/base/globals.json');
let lang = require('./db/locales/en/locale.json').templates;

let data = {};

for (const objecto of globals.data.config.RestrictionsInRaid){
	if(typeof lang[objecto.TemplateId] != "undefined"){
		data[lang[objecto.TemplateId].Name] = objecto.Value;
	} else {
		console.log("Failed: " + objecto.TemplateId);
	}
}
console.log(data);

let count = 1;
for(const level of globals.data.config.exp.level.exp_table){
	console.log(`${count}: ${level.exp}`);
	count++;
}