class Constants {
    constructor() {
      this.ServerVersion = "1.2.1";

      this.DefaultGameplayJson = {
        "autosave": {
          "saveOnReceive": false,
          "saveOnExit": true,
          "saveIntervalSec": 300 // once per 5 min
        },
        "inraid": {
          "saveLootEnabled": true,
          "saveWeaponDurability": true,
          "saveHealthEnabled": true,
          "saveHealthMultiplier": 0.1,
          "miaOnTimerEnd": true
        },
        "other": {
          "RedeemTime": 48
        },
        "defaultRaidSettings": {
          "aiAmount": "AsOnline",
          "aiDifficulty": "AsOnline",
          "bossEnabled": true,
          "scavWars": false,
          "taggedAndCursed": false
        },
        "hideout": {
          "productionTimeDivide": {
            "Areas": 100,
            "ScavCase": 100,
            "Production": 100
          }
        },
        "bots": {
          "pmc": {
            "enabled": true,
            "usecChance": 50,
            "types": {
              "followerTest": 100,
              "bossTest": 100,
              "assault": 35,
              "pmcBot": 35
            }
          },
          "amountSend": {
            "assault": 30,
            "marksman": 30,
            "pmcBot": 30,
            "bossBully": 30,
            "bossGluhar": 30,
            "bossKilla": 30,
            "bossKojaniy": 30,
            "bossSanitar": 30,
            "followerBully": 30,
            "followerGluharAssault": 30,
            "followerGluharScout": 30,
            "followerGluharSecurity": 30,
            "followerGluharSnipe": 30,
            "followerKojaniy": 30,
            "followerSanitar": 30,
            "test": 30,
            "followerTest": 30,
            "bossTest": 30
          }
        },
        "trading": {
          "ragfairMultiplier": 3.5,
          "repairMultiplier": 1,
          "insureMultiplier": 0.1,
          "insureReturnChance": 75,
          "fenceAssortSize": 5,
          "buyItemsMarkedFound": true,
          "traderSupply": {
            "5a7c2eca46aef81a7ca2145d": 3600,
            "5ac3b934156ae10c4430e83c": 3600,
            "5c0647fdd443bc2504c2d371": 3600,
            "54cb50c76803fa8b248b4571": 3600,
            "54cb57776803fa99248b456e": 3600,
            "579dc571d53a0658a154fbec": 600,
            "5935c25fb3acc3127c3d8cd9": 3600,
            "58330581ace78e27b8b10cee": 3600
          }
        },
        "location": {
          "botMaxCap": 20,
          "realTimeEnabled": true,
          "forceWeatherEnabled": false,
          "forceWeatherId": 6, // sunny weather
          "loot": {
            "containers": {
              "ChanceForEmpty": 5,
              "ChanceToSpawnNextItem": 35,
              "AttemptsToPlaceLoot": 1
            },
            "RarityMultipliers": {
              "Not_exist": 0,
              "Common": 0.8,
              "Uncommon": 0.7,
              "Rare": 0.6,
              "Superrare": 0.01
            },
            "noDuplicatesTill": 1,
            "useDynamicLootFromItemsArray": false,
            "useDynamicLootMultiplier": true
          }
        },
        "match": {
          "enabled": false,
          "info": "Enables online matching. Not supported!"
        }
      };
      this.DefaultModsJson = {};
      this.DefaultServerJson = {
        "ip": "127.0.0.1",
        "ip_backend": "127.0.0.1",
        "port": 443,
        "eventPollIntervalSec": 60,
        "rebuildCache": true,
        "name": "JustEmuTarkov",
        "Patches": {
          "RemoveAddOfferButton_Awake": true,
          "RemoveAddOfferButton_Call": true,
          "ReplaceInMainMenuController": true,
          "ReplaceInPlayer": true,
          "AutoSetOfflineMatch": true,
          "BringBackInsuranceScreen": true,
          "DisableReadyButtonOnFirstScreen": true,
          "DisableReadyButtonOnSelectLocation": true,
          "NoFilters": false,
          "OldStreamerMode": false,
          "UnlockItem24CharId": true,
          "EndByTimer": true,
          "ExperienceGainFix": true,
          "OfflineSaveProfile": true,
          "OfflineSpawnPoint": true,
          "UpdateDogtagOnKill": true,
          "BossSpawnChance": true,
          "BotSettingsLoad": true,
          "BotTemplateLimit": true,
          "CoreDifficulty": true,
          "LoadBotDifficultyFromServer": true,
          "LoadBotTemplatesFromServer": false,
          "MaxBotCap": true,
          "RemoveUsedBotProfile": true,
          "SpawnPmc": true,
          "SpawnRandomizationMod": true,
          "TinnitusFix": false,
          "LoadOfflineRaidScreen": false,
          "DisableScavMode": true,
          "ScavExfilFix": false,
          "ScavPrefabLoad": false,
          "ScavProfileLoad": false,
          "ScavSpawnPoint": false,
          "BarterSchemeAutoFill": true,
          "BarterSchemeAutoFillPersist": true
        },
        "PatchNodes": {
          "Flea": true,
          "HealthListner": true,
          "MatchMaker": true,
          "Other": true,
          "Progression": true,
          "Quests": true,
          "Raid": true,
          "ScavMode": true,
          "Trading": true
        },
        "lootDebug": true,
        "hideInfoLogs": false,
        "showDebugLogs": false,
        "debugTimer": true,
        "translations": {
          "alreadyInUse": "The nickname is already in use",
          "tooShort": "The nickname is too short"
        }
      };

    }
}
module.exports.struct = new Constants();