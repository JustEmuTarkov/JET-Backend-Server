let fileIO = require("./fileIO.js");

let fenceSuite = fileIO.readParsed("./suits_fence.json");
let ragmanSuite = fileIO.readParsed("./suits_ragman.json");

let IDList = [];
for(let suit of fenceSuite)
{
  if(!IDList.includes(suit.suiteId))
    IDList.push(suit.suiteId)
} 
for(let suit of ragmanSuite)
{
  if(!IDList.includes(suit.suiteId))
    IDList.push(suit.suiteId)
} 
console.log(IDList);
