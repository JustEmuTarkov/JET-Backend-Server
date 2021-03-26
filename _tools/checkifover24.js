// ####
// Checks character.json (should be in same dir as this script) for duplicate IDs
// ####

// let profile = require("./character.json")
const fs = require('fs')
let profile = JSON.parse(fs.readFileSync("character.json"))
const util = require('util')
util.inspect.defaultOptions.maxArrayLength = null; 

let cnt = 0

for (let k in profile.Inventory.items) {
    if (profile.Inventory.items[k]._id.length < 24) {
        let old = profile.Inventory.items[k]._id
        let str = profile.Inventory.items[k]._id

        while (str.length < 24) {
            str += "X"
        }

        profile.Inventory.items[k]._id = str;

        console.log(`ID found under length. Key: ${k} \n    > Converted ID ${old} to ${str}`)
        cnt++
    }
}

console.log("\n --> Changed " + cnt + " IDs.");

fs.writeFileSync("character.json", JSON.stringify(profile));