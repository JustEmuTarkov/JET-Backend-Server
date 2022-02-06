const fs = require("fs");


const data = JSON.parse(fs.readFileSync("../../user/cache/items.json")).data;

var MapData_Moddable = {};
var MapData_Containers = {};

for(let id in data){
    const item = data[id];
    
    // Weapons and Mods
    if(item._props.Slots && item._props.Slots != []){
        //console.log(`>Name: ${item._name}`)
        for(let slot of item._props.Slots){
            //console.log(` >Slot: ${slot._name}`)
            if(slot._props.filters){
                let _filter = [];
                for(let filter of slot._props.filters)
                {
                    //console.log(Object.keys(filter));
                    for(let item of filter.Filter){
                        if(_filter.indexOf(item) == -1)
                            _filter.push(item)
                    }
                }
                if(!MapData_Moddable[item._name]){
                    MapData_Moddable[item._name] = { _id: item._id };
                }
                MapData_Moddable[item._name][slot._name] = {
                    Filter: _filter
                };
            }
            //MapData[slot._name] = slot._props;
        }
    }
    // Backpacks and Rigs
    if(item._props.Grids && item._props.Grids != []){
        //console.log(`>Name: ${item._name}`)
        for(let grid of item._props.Grids){
            //console.log(` >Slot: ${slot._name}`)
            if(grid._props.filters){
                let _filter = [];
                let _exfilter = [];
                for(let filter of grid._props.filters)
                {
                    //console.log(Object.keys(filter));
                    for(let item of filter.Filter){
                        if(_filter.indexOf(item) == -1)
                            _filter.push(item)
                    }
                    for(let item of filter.ExcludedFilter)
                    {
                        if(_exfilter.indexOf(item) == -1)
                            _exfilter.push(item)
                    }
                }
                if(!MapData_Containers[item._name]){
                    MapData_Containers[item._name] = { _id: item._id };
                }
                MapData_Containers[item._name][grid._name] = {
                    Filter: _filter,
                    ExcludedFilter: _exfilter
                };
            }
            //MapData[slot._name] = slot._props;
        }
    }
}

fs.writeFileSync("./MapData_Moddable.json", JSON.stringify(MapData_Moddable, null, " "));
fs.writeFileSync("./MapData_Containers.json", JSON.stringify(MapData_Containers, null, " "));