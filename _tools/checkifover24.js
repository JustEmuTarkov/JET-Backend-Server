// ####
// Checks character.json (should be in same dir as this script) for duplicate IDs
// ####

const profile = require("./character.json")
const util = require('util')
util.inspect.defaultOptions.maxArrayLength = null; 

for (let k in profile.Inventory.items) {
    if (profile.Inventory.items[k]._id.length > 24) {
        console.log(`ID found over length. Key: ${k} ID: ${profile.Inventory.items[k]._id}`)
    } else if (profile.Inventory.items[k]._id.length < 24) {
        console.log(`ID found under length. Key: ${k} ID: ${profile.Inventory.items[k]._id}`)
    }
}