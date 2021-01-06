// ####
// Checks character.json (should be in same dir as this script) for duplicate IDs
// ####

const profile = require("./character.json")
const util = require('util')
util.inspect.defaultOptions.maxArrayLength = null; 

const len = profile.Inventory.items.length;
let seen = []
let duplicates = []

for (let k in profile.Inventory.items) {
    if (seen.includes(profile.Inventory.items[k]._id)) {
        duplicates.push(profile.Inventory.items[k]._id)
        console.log(`Duplicate item found: Key: ${k} ID: ${profile.Inventory.items[k]._id}`)
    } else {
        seen.push(profile.Inventory.items[k]._id)
    }
}

console.log("Total items: " + len);
console.log("Seen items: " + seen.length)
console.log("Duplicate items: " + duplicates.length)