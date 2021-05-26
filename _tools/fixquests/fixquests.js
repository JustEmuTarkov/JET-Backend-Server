/*
****
In 12.10, BSG changed quests so that many of their `AvailableToStart` parameters were empty to fix quests not being finishable. 
To remedy this, we need to copy the `AvailableToStart` arrays from an old dump with them filled to the new dumps.
***

***
takefrom.json = quests dump WITH the correct AvailableToStart parameters.
giveto.json = quests dump WITHOUT AvailableToStart (post-12.10 dumps)
***
*/

const fs = require('fs')
if (!fs.existsSync("./output")) { fs.mkdirSync("./output") }
if (!fs.existsSync("./output/quests.json")) { fs.copyFileSync("./giveto.json", "./output/quests.json") } else { return console.error("Output file already exists.") }

let takefrom = require('./takefrom.json')
let giveto = require('./output/quests.json')

let questMap = {}

for (let quest in takefrom) {
    questMap[takefrom[quest]._id] = takefrom[quest].conditions.AvailableForStart
}

for (let dest in giveto) {
    for (let src in questMap) {
        if (src === giveto[dest]._id) {
            giveto[dest].conditions.AvailableForStart = questMap[src]
        }
    }
}

try {
    fs.writeFileSync("./output/quests.json", JSON.stringify(giveto, null, 4))
    console.log("Wrote to output/quests.json.")
} catch (e) {
    console.error(e.stack)
}

