// ####
// Creates the db/customization folder from an HTTP response dump for client/customization.
// ####

const dump = require('./dump.json')
const fs = require('fs')

if (!fs.existsSync("./output")) { fs.mkdirSync("./output")}

for (let k in dump.data) {
    fs.writeFile(__dirname + `/output/${dump.data[k]._id}.json`, JSON.stringify(dump.data[k]), (err, res) => {
        if (err) return console.error(err)
        else console.log(`Wrote ${dump.data[k]._id}.json.`)
    })
}