const fs = require("fs")

const files = fs.readdirSync(__dirname).filter((i) => i.slice(-2) !== "js" && i !== 'dist').map(x => require(`./${x}`))

if (!fs.existsSync(`${__dirname}/dist/`)) {
    fs.mkdirSync(`${__dirname}/dist/`)
}

files.forEach((obj) => {
    let object = {}
    if (obj['base']) { // this is an already converted location.
        console.log(`${obj.base.Id} already converted, copying to /dist/ anyways...`)
        object = obj;
    } 
    if (!obj.Location && !obj['base']) { // this is a hideout location.
        object['base'] = obj; 
    } else if (obj.Location) { // this is an unconverted location.
        console.log(`Converting ${obj.Location.Id}...`)
        object['base'] = obj.Location
    }

    fs.writeFile(`${__dirname}/dist/${(object.base.Id).toLowerCase()}.json`, JSON.stringify(object), (err) => { if (err) return console.error(err) });
})

console.log("Done.")