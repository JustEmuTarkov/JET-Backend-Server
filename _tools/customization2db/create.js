// ####
// Creates the db/customization folder from an HTTP response dump for client/customization.
// ####

const dump = require('./dump.json')
const fs = require('fs')

if(typeof dump.data != "undefined")
  dump = dump.data

for (let k in dump) {
    if (!fs.existsSync("./output")) { fs.mkdirSync("./output")}
    fs.writeFile(__dirname + `/output/${k}.json`, JSON.stringify(dump[k]), (err, res) => {
        if (err) return console.error(err)
        else console.log(`Wrote ${k}.json.`)
    })
}