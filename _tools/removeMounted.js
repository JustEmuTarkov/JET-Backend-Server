let fs = require("fs");

let maps = [
    "bigmap",
    "develop",
    "interchange",
    "laboratory",
    "lighthouse",
    "rezervbase",
    "shoreline",
    "woods",
];

for(let map of maps){
    let mapfile = JSON.parse(fs.readFileSync("" + map + ".json"));
    //mapfile.mounted
    let newMounted = [];
    for(let mountI of mapfile.mounted)
    {
        if(mountI == null) continue;
        if (typeof mountI.Items[0] != "string")
        {
            newMounted.push(mountI);
        }
    }
    mapfile.mounted = newMounted;
    fs.writeFileSync("" + map + ".json", JSON.stringify(mapfile, null, " "));
}

