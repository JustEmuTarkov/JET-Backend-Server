const lodash = require('./lodash')

const newQuestBase = require('./base.quests.json')
const oldQuestBase = require('./oldquests.json')


let duplicates = []
let halfduplicates = []

for (let o in oldQuestBase) {
    let oq = oldQuestBase[o]
    for (let n in newQuestBase) {
        let nq = newQuestBase[n]

        // Check for ID equality.
        if (oq._id === nq._id) {

            // Check for total equality.
            if (lodash.isEqual(oq, nq)) {
                duplicates.push(nq._id)
                continue;

            // Check for key equality.
            } else {
                console.log(`Quest ${nq._id} exists in both, but the parameters have changed.`)
                halfduplicates.push(nq._id)

                let oqk = Object.keys(oq)
                let nqk = Object.keys(nq)

                for (let key in oqk) {
                    let okey = oqk[key]
                    let res = nqk.some(k => k === okey)
                    if (!res) {
                        console.log(`Key ${okey} does not exist in new ${nq._id}.`)
                    }
                }

                continue;
            }
        }
    }
}

console.log("New quest count: " + newQuestBase.length)
console.log("Old quest count: " + oldQuestBase.length)
console.log("Exact duplicates: ");
console.log(duplicates)
console.log("Half duplicates: ");
console.log(halfduplicates)



