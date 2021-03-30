# Server Readme.md
  
## Preparing to Use dev build
  
- Get node from [Node x64](https://nodejs.org/dist/v14.10.0/node-v14.10.0-x64.msi) or [Node x32](https://nodejs.org/dist/v14.10.0/node-v14.10.0-x86.msi)  
  - If its not working as intended uninstall it and get one of LTS version's [Node x64](https://nodejs.org/dist/v12.18.3/node-v12.18.3-x64.msi) or [Node x32](https://nodejs.org/dist/v12.18.3/node-v12.18.3-x86.msi)  
- After you have installed `node` run this file `_installDependencies.cmd`
- (if folder `user/cache` is empty) Extract data from `db_RemovableData.7z` to `db` folder and Make sure to run `removeCache.cmd` just incase
- To start server use `_startServer.cmd` (Server should have premade cache)  
- [optional] Run `removeUselessDB_folders.cmd` to lower down size of server and remove unused folders from DB (disclaimer if you gonna install mods or editing db files make sure to not run this .cmd file)  
  
_Let me know if its missing something in the instalation/run_   

## Changelog
- alot of changes follow: [https://trello.com/b/U1vJDcHR/129-update](https://trello.com/b/U1vJDcHR/129-update)

## Other Informations
- server is going into direction of being usable for modders and players

## Variables Accessing and Structure  
- [Server Structure Link](https://git.justemutarkov.eu/JustEmuTarkov/Server_Documentation/src/master/ServerStructure.json)  

## Thanks
_All thanks to great community and JET dev team_