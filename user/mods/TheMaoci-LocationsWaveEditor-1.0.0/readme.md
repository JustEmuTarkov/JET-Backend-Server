Made By TheMaoci

## Info
The mod does the following:
- loads files from locations folder into waves

wave file structure (name of file is not important)

Default Waves:
```
{
	"TimeFromMatchStart": {
		"minimum": 0,
		"maximum": 1
	},
	"SpawnedAmount": {
		"minimum": 0,
		"maximum": 1
	},
	"SpawnPoints": "",
	"BotSide": "Savage",
	"BotPreset": "normal",
	"WildSpawnType": "assault",
	"isPlayers": true
}
```
Boss Waves: (filename need to start with "boss")
```
{
	"BossName": "pmcBot",
	"BossChance": 100,
	"BossZone": "BotZoneFloor1",
	"BossPlayer": false,
	"BossDifficult": "normal",
	"BossEscortType": "pmcBot",
	"BossEscortDifficult": "normal",
	"BossEscortAmount": "2,2,3",
	"Time": 0,
	"TriggerId": "",
	"TriggerName": "",
	"Delay": 0
}
```
also supports adding waves in bulks so make sure to structure it as this example below
```
[
	{ "Wave info from above #1" },
	{ "Wave info from above #2" }
]
```
you can get the informations on what to input inside by checking already used waves in db.locations[locationName.json].base you can use mozilla to easly parse that data

* -1 in times means disabled ??

if you gonna make a repack of this mod make sure to change name for it to match your mod thingy :) also any file located in proper folders will be loaded without looking at file name so fee l free to put your names inside ;)