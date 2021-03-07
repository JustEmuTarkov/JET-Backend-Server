const quests = require('./quest.json')

for (let k in quests) {
    if (!quests[k].name || quests[k].name === "") {
        continue;
    } else {
        console.log(`"${k}" // ${quests[k].name}`)
    }
}