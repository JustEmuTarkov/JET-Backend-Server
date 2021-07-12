## Creating Mods 101

#### Mods structure

- folder "src" where you store your js scripts
- file mod.config.json where you store mod data (can also store your mod specific data like configuration settings but not adviced)

Example of file structure

```
-| YourModFolderName_Version
--\
---|> src
---|\
---| |> script.js
---|
---|> mod.config.json
---|> readme.md
```

info:

- mod folder name is not stricted to this name you can name it as you want it doesn't matter.

Example of mod.config.json

```json
{
  "name": "YourModName",
  "author": "YourNickname",
  "version": "1.0.0",
  "src": {
    "src/script.js": "TypeOfModLoading"
  },
  "required": []
}
```

- TypeOfModLoading
  - CacheModLoad [Loading mod just after creating cache folder data],
  - TamperModLoad [Loading mod just before server is started]
- src is structured as object where key is path to file from your mod folder using / as separators cause windows ones break code from time to time and this one is easier to understand. and a TypeOfModLoading as string value
- required: contains mods that are required to run your mod you can specify name and version examples are looking as shown below.

Example of: exacly that version of the mod is required

```json
...
"required": [
    {"name": "RequiredModName", "ver": "1.0.1"}
]
...
```

Example of: that version or newer of the mod is required

```json
...
"required": [
    {"name": "RequiredModName", "ver": "^1.0.1"}
]
...
```

Example of: script.js - which is loaded automatically after you specify it in mod.config.json

```js
exports.mod = (mod_info) => {
  /// do your code here ///
};
```

- mod_info -> contains your mod.config.json

## Loading files from your Mod folder

_giving that you trying to load it from your script file_

How to create your mod unique id used to load your mod:

```js
const myUniqueID = `${mod_info.name}-${mod_info.version}_${mod_info.author}`;
```

Accessing loaded mods data (from user/configs/mods.json)

```js
console.log(globals.mods.toLoad[myUniqueID]);
```

will output something like this:

```json
{
  "isEnabled": true,
  "folder": "YourModFolderName",
  "order": 1
}
```

to load file from your script.js file do as follows

```js
const myUniqueID = `${mod_info.name}-${mod_info.version}_${mod_info.author}`;
let myDataLoadedFromModFolder = fileIO.readParsed(
  `user/mods/${globals.mods.toLoad[myUniqueID].folder}/yourfile.json`
);
```

### Other usefull functions

`fileIO.typeNameOfFunctionHere(pass some parameters here)`

list of functions for fileIO global object:

- stringify(data, oneLiner) // oneLiner[default: false]
- createReadStream(filePath) // works same as fs.createReadStream(filePath)
- createWriteStream(filePath) // works same as fs.createWriteStream(filePath, {flags: 'w'})
- readParsed(filePath) // works same as JSON.parse(fs.readFileSync(file, 'utf8'))
- parse(string) // works same as JSON.parse(string)
- read(file) // works same as fs.readFileSync(file, 'utf8')
- exist(file) // works same as fs.existsSync(file)
- readDir(path) // works same as fs.readdirSync(path)
- statSync(path) // works same as fs.statSync(path)
- lstatSync(path) // works same as fs.lstatSync(path)
- unlink(path) // works same as fs.unlinkSync(path)
- rmDir(path) // works same as fs.rmdirSync(path)
- mkDir(path) // works same as fs.mkdirSync(path)
- write(filePath, data, raw, atomic) // raw[default: false], atomic[default:true]

logging can be done in 2 ways:

1. using internal logger:

- logger.logError(text);
- logger.logWarning(text);
- logger.logSuccess(text);
- logger.logDebug(text);
- logger.logInfo(text);
- logger.logRequest(text, data); // data[default: ""]
- logger.logData(data);
- logger.throwErr(message, where, additional) // additional[default: ""] -> throws application error like exception

2. using console.log:

- console.log(unparsedDataHere);
