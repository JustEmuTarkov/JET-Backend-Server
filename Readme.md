# Server Readme.md
  
## Preparing to Use dev build
  
- Get latest node from https://nodejs.org/en/
- (if folder `user/cache` is empty) Extract data from `db_RemovableData.7z` to `db` folder and Make sure to run `removeCache.cmd` just incase
- To start server use `_startServer.cmd` (Server should have premade cache)  

## Compiling to Windows EXE, Linux or MacOS
- Open GitBash 
- Execute pkg .
- Wait until JustEmuTarkov-win.exe, JustEmuTarkov-linux, JustEmuTarkov-macos appear

OR

Run _build.bat which should do it all for you! If it doesn't its because I suck at batch files.

## Distribution
Zip the following folders & files
- core (this is likely unwanted but pkg is not handling this correctly yet)
- db
- docs
- node_modules
- res
- src
- user 
- JustEmuTarkov-win.exe

## Changelog
- alot of changes follow: [https://trello.com/b/U1vJDcHR/129-update](https://trello.com/b/U1vJDcHR/129-update)

## Other Informations
- server is going into direction of being usable for modders and players

## Variables Accessing and Structure  
- [Server Structure Link](https://git.justemutarkov.eu/JustEmuTarkov/Server_Documentation/src/master/ServerStructure.json)  

## Thanks
_All thanks to great community and JET dev team_

More information at: JustEmuTarkov Discord
