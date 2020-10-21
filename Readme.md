# Server Readme.md
  
## Preparing to use
  
- Get node from [Node x64](https://nodejs.org/dist/v14.10.0/node-v14.10.0-x64.msi) or [Node x32](https://nodejs.org/dist/v14.10.0/node-v14.10.0-x86.msi)  
  - If its not working as intended uninstall it and get one of LTS version's [Node x64](https://nodejs.org/dist/v12.18.3/node-v12.18.3-x64.msi) or [Node x32](https://nodejs.org/dist/v12.18.3/node-v12.18.3-x86.msi)  
- After you have installed `node` run this file `_installDependencies.cmd`
- (if folder `user/cache` is empty) Extract data from `db_RemovableData.7z` to `db` folder and Make sure to run `removeCache.cmd` just incase
- To start server use `_startServer.cmd` (Server should have premade cache)  
- [optional] Run `removeUselessDB_folders.cmd` to lower down size of server and remove unused folders from DB (disclaimer if you gonna install mods or editing db files make sure to not run this .cmd file)  
  
_Let me know if its missing something in the instalation/run_  
  
  
## Database folders
  
**This folders are not required after "cache" is done**
- assort
- customization 
- hideout 
- items  
- locales  
- locations  
- ragfair
- templates  
- weather  

## Changelog
  
- few changes i forgot about...
- fixed assort,customization,hideout,items,locales,locations,ragfair,templates,weather not required after caching is done  
- reduced usable server size from insane file amount up to <5000 files  
- rewrited bots health system now its more cleaner  
- added utils (unzip archive) - TODO: which im gona use later if someone will not unpack archive but start server  
- fixed some retarded js practices  
- abit updated cacheing scripts  
- cleaned up logger to display data more clearly  
- fixed json.js scripts now it shouldnt crash like previously, one liner scripts in stringify (YESS FINALLY)  
- better gitignore...  
- fixed package.json...  
- rewrited watermark.js now its much cleaner to use it...  
- added scripts for multiplayer (/server/profile/<userID> which respond with selected by userID profile)
- now we dont need bilions files of items.json it got concated into Nodes whic his much cleaner and much readable then b4
- database sync'ed for 0.12.7.9018
- rewrited src/callbacks (all files are loaded automatickly without any config files)
- rewrited src/response (all files are loaded automatickly without any config files)
- rewrited src/classes (all files are loaded automatickly without any config files)
- applied PandaDriver156 fixed for launching server (this. and moving "DONE" callback)
- changing abit main.js and initialize.js

## Other Informations

- all not required after cacheing folders are storaged at `db_RemovableData.7z` which you can bring back anytime
- file `removeUselessDB_folders.cmd` removes folders listed above from db folder.
- `all_locales.7z` contains all locales which you can include to your server it weights too much so thats why i left it in archive - you will need to edit them abit so make sure you dont mess it up :)

## Variables accessing and structure
  _unifying global scope variables_
variables below are global which means you can access them without assigning them anywhere.
  
- startTimestamp -> variable contains start time you can use it to calculate time between starting and current time
  
- internal -> variable container
  - fs -> fs package
  - path -> path package
  - util -> util package
  - resolve -> path.resolve package
  - zlib -> zlib package
  - https -> https package
  - selfsigned -> selfsigned package
  - psList -> ps-list package
  - process -> process package
  
- executedDir -> actual path to this application
  
- json -> handles all of IO in the server readign writing checking creating of the files paths folders etc.
  - stringify(data, isOneLiner) -> if flag isOneLiner is true it will create string without any beautifiers jsut raw string.
  - createReadStream(filePath) -> fs.createReadStream(file)
  - createWriteStream(filePath) -> fs.createWriteStream(file, {flags: 'w'})
  - readParsed(filePath) -> JSON.parse(internal.fs.readFileSync(file, 'utf8'))
  - parse(string) -> JSON.parse(string)
  - read(file) -> fs.readFileSync(file, 'utf8')
  - write(file, data, isSavedAsRaw)
  - exist(file) -> fs.existsSync(file)
  - readDir(file) -> fs.readdirSync(path)
  - statSync(file) -> fs.statSync(path)
  - lstatSync(file) -> fs.lstatSync(path)
  - unlink(file) -> fs.unlinkSync(path)
  - rmDir(file) -> fs.rmdirSync(path)
  - mkDir(file) -> fs.mkdirSync(path)
  
- utility
  - getCookies(req)
  - clearString(string)
  - getRandomInt(min = 0, max = 100)
  - getRandomIntEx(max)
  - getDirList(path)
  - removeDir(path)
  - getServerUptimeInSeconds()
  - getTime()
  - formatTime(date)
  - getDate()
  - formatDate(date)
  - makeSign(length)
  - generateNewAccountId()
  - generateNewItemId()
  - generateNewDialogueId()
  - generateNewId()
  - secondsToTime(timestamp)
  - isUndefined(data)
  
- logger
  - logError(text) -> display and log error message
  - logWarning(text) -> display and log warning message
  - logSuccess(text) -> display and log success message
  - logInfo(text) -> display and log info message
  - logRequest(text, data = "") -> display and log request message
  - logData(data) -> display and log data message
  - throwErr(message, where, additional) -> throw "" - nothing more to precise
  - log(type, data, colorFront, colorBack) -> type is string put whatever you want there it will be colored, colors[black,red,green,yellow,blue,magenta,cyan,white]
  

