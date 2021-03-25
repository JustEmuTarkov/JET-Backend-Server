exports.mod = (mod_info) => {
    logger.logInfo("[MOD] LocationsWaveEditor");
	let ModPath = `user/mods/${mod_info.author}-${mod_info.name}-${mod_info.version}/`;
	let locationNames = fileIO.readDir(ModPath + "locations"); // this.Locations[location]
	let config = require("../config.json");
	for(let locationName of locationNames){
		let Waves = fileIO.readDir(ModPath + "locations/" + locationName);
		if(Waves.length <= 0) continue;
		
		if(config.overrideWaves){
			//Clear Waves Now
			location_f.handler.Locations[locationName].base.waves = [];
		}
		let countWaves = location_f.handler.Locations[locationName].base.waves.length;
		let countBossWaves = location_f.handler.Locations[locationName].base.BossLocationSpawn.length;
		let org_countWaves = countWaves;
		let org_countBossWaves = countBossWaves;
		for(let wave of Waves){
			let LoadFile = require("../locations/" + locationName + "/" + wave);
			
			if(Object.prototype.toString.call(LoadFile) == '[object Array]')
			{
				// its an array so load it as its an array
				for(let waveInfo of LoadFile){
					if(wave.indexOf("boss") == 0){
						let WaveStruct = {
							"BossName": waveInfo.BossName,
							"BossChance": waveInfo.BossChance,
							"BossZone": waveInfo.BossZone,
							"BossPlayer": waveInfo.BossPlayer,
							"BossDifficult": waveInfo.BossDifficult,
							"BossEscortType": waveInfo.BossEscortType,
							"BossEscortDifficult": waveInfo.BossEscortDifficult,
							"BossEscortAmount": waveInfo.BossEscortAmount,
							"Time": waveInfo.Time,
							"TriggerId": waveInfo.TriggerId,
							"TriggerName": waveInfo.TriggerName,
							"Delay": waveInfo.Delay
						};
						location_f.handler.Locations[locationName].base.BossLocationSpawn.push(WaveStruct);
						countBossWaves++;
					} else {
						let WaveStruct = {
							number: countWaves,
							time_min: waveInfo.TimeFromMatchStart.minimum,
							time_max: waveInfo.TimeFromMatchStart.maximum,
							slots_min: waveInfo.SpawnedAmount.minimum,
							slots_max: waveInfo.SpawnedAmount.maximum,
							SpawnPoints: waveInfo.SpawnPoints,
							BotSide: waveInfo.BotSide,
							BotPreset: waveInfo.BotPreset,
							WildSpawnType: waveInfo.WildSpawnType,
							isPlayers: waveInfo.isPlayers,
						};
						location_f.handler.Locations[locationName].base.waves.push(WaveStruct);
						countWaves++;
					}
					
				}
			} else {
				if(wave.indexOf("boss") == 0){
					let WaveStruct = {
						"BossName": LoadFile.BossName,
						"BossChance": LoadFile.BossChance,
						"BossZone": LoadFile.BossZone,
						"BossPlayer": LoadFile.BossPlayer,
						"BossDifficult": LoadFile.BossDifficult,
						"BossEscortType": LoadFile.BossEscortType,
						"BossEscortDifficult": LoadFile.BossEscortDifficult,
						"BossEscortAmount": LoadFile.BossEscortAmount,
						"Time": LoadFile.Time,
						"TriggerId": LoadFile.TriggerId,
						"TriggerName": LoadFile.TriggerName,
						"Delay": LoadFile.Delay
					};
					location_f.handler.Locations[locationName].base.BossLocationSpawn.push(WaveStruct);
					countBossWaves++;
				} else {
					let WaveStruct = {
						number: countWaves,
						time_min: LoadFile.TimeFromMatchStart.minimum,
						time_max: LoadFile.TimeFromMatchStart.maximum,
						slots_min: LoadFile.SpawnedAmount.minimum,
						slots_max: LoadFile.SpawnedAmount.maximum,
						SpawnPoints: LoadFile.SpawnPoints,
						BotSide: LoadFile.BotSide,
						BotPreset: LoadFile.BotPreset,
						WildSpawnType: LoadFile.WildSpawnType,
						isPlayers: LoadFile.isPlayers,
					};
					location_f.handler.Locations[locationName].base.waves.push(WaveStruct);
					//Apply New Wave Now
					countWaves++;
				}
			}
		}
		logger.logInfo("Waves: "+org_countWaves+">" + countWaves + ", Boss Waves: "+org_countBossWaves+">"+countBossWaves+") on map " + locationName);
	}
	
	logger.logSuccess("[MOD] LocationsWaveEditor; Applied");
}