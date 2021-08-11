class Responses {
  constructor() {
    this.staticResponses = {
      "/client/account/customization": this.clientAccountCustomization,
      "/client/chatServer/list": this.clientChatServerList,
      "/client/checkVersion": this.clientCheckVersion,
      "/client/customization": this.clientCustomization,
      "/client/friend/list": this.clientFriendList,
      "/client/friend/request/list/inbox": this.clientFriendRequestListInbox,
      "/client/friend/request/list/outbox": this.clientFriendRequestListOutbox,
      "/client/friend/request/send": this.clientFriendRequestSend,
      "/client/game/bot/generate": this.clientGameBotGenerate,
      "/client/game/config": this.clientGameConfig,
      "/client/game/keepalive": this.clientGameKeepalive,
      "/client/game/logout": this.clientGameLogout,
      "/client/game/profile/create": this.clientGameProfileCreate,
      "/client/game/profile/items/moving": this.clientGameProfileItemsMoving,
      "/client/game/profile/list": this.clientGameProfileList,
      "/client/game/profile/nickname/change": this.clientGameProfileNicknameChange,
      "/client/game/profile/nickname/reserved": this.clientGameProfileNicknameReserved,
      "/client/game/profile/nickname/validate": this.clientGameProfileNicknameValidate,
      "/client/game/profile/savage/regenerate": this.clientGameProfileSavageRegenerate,
      "/client/game/profile/search": this.clientGameProfileSearch,
      "/client/game/profile/select": this.clientGameProfileSelect,
      "/client/game/profile/voice/change": this.clientGameProfileVoiceChange,
      "/client/game/start": this.clientGameStart,
      "/client/game/version/validate": this.clientGameVersionValidate,
      "/client/getMetricsConfig": this.clientGetMetricsConfig,
      "/client/globals": this.clientGlobals,
      "/client/handbook/builds/my/list": this.clientHandbookBuildsMyList,
      "/client/handbook/templates": this.clientHandbookTemplates,
      "/client/hideout/areas": this.clientHideoutAreas,
      "/client/hideout/production/recipes": this.clientHideoutProductionRecipes,
      "/client/hideout/production/scavcase/recipes": this.clientHideoutProductionScavcaseRecipes,
      "/client/hideout/settings": this.clientHideoutSettings,
      "/client/insurance/items/list/cost": this.clientInsuranceItemsListCost,
      "/client/items": this.clientItems,
      "/client/items/prices": this.clientItemsPrices,
      "/client/languages": this.clientLanguages,
      "/client/locations": this.clientLocations,
      "/client/mail/dialog/getAllAttachments": this.clientMailDialogGetAllAttachments,
      "/client/mail/dialog/info": this.clientMailDialogInfo,
      "/client/mail/dialog/list": this.clientMailDialogList,
      "/client/mail/dialog/pin": this.clientMailDialogPin,
      "/client/mail/dialog/read": this.clientMailDialogRead,
      "/client/mail/dialog/remove": this.clientMailDialogRemove,
      "/client/mail/dialog/unpin": this.clientMailDialogUnpin,
      "/client/mail/dialog/view": this.clientMailDialogView,
      "/client/match/available": this.clientMatchAvailable,
      "/client/match/exit": this.clientMatchExit,
      "/client/match/group/create": this.clientMatchGroupCreate,
      "/client/match/group/delete": this.clientMatchGroupDelete,
      "/client/match/group/exit_from_menu": this.clientMatchGroupExit_From_Menu,
      "/client/match/group/invite/accept": this.clientMatchGroupInviteAccept,
      "/client/match/group/invite/cancel": this.clientMatchGroupInviteCancel,
      "/client/match/group/invite/send": this.clientMatchGroupInviteSend,
      "/client/match/group/looking/start": this.clientMatchGroupLookingStart,
      "/client/match/group/looking/stop": this.clientMatchGroupLookingStop,
      "/client/match/group/start_game": this.clientMatchGroupStart_Game,
      "/client/match/group/status": this.clientMatchGroupStatus,
      "/client/match/join": this.clientMatchJoin,
      "/client/match/offline/start": this.clientMatchOfflineStart,
      "/client/match/offline/end": this.clientMatchOfflineEnd,
      "/client/match/updatePing": this.clientMatchUpdatePing,
      "/client/notifier/channel/create": this.clientNotifierChannelCreate,
      "/client/profile/status": this.clientProfileStatus,
      "/client/putMetrics": this.clientPutMetrics,
      "/client/quest/list": this.clientQuestList,
      "/client/ragfair/find": this.clientRagfairFind,
      "/client/ragfair/itemMarketPrice": this.clientRagfairItemMarketPrice,
      "/client/ragfair/search": this.clientRagfairSearch,
      "/client/server/list": this.clientServerList,
      "/client/settings": this.clientSettings,
      "/client/trading/api/getTradersList": this.clientTradingApiGetTradersList,
      "/client/trading/api/traderSettings": this.clientTradingApiTraderSettings,
      "/client/trading/customization/storage": this.clientTradingCustomizationStorage,
      "/client/weather": this.clientWeather,
      "/launcher/profile/change/email": this.launcherProfileChangeEmail,
      "/launcher/profile/change/password": this.launcherProfileChangePassword,
      "/launcher/profile/change/wipe": this.launcherProfileChangeWipe,
      "/launcher/profile/get": this.launcherProfileGet,
      "/launcher/profile/login": this.launcherProfileLogin,
      "/launcher/profile/register": this.launcherProfileRegister,
      "/launcher/profile/remove": this.launcherProfileRemove,
      "/launcher/server/connect": this.launcherServerConnect,
      "/mode/offline": this.modeOffline,
      "/player/health/events": this.playerHealthEvents,
      "/player/health/sync": this.playerHealthSync,
      "/raid/map/name": this.raidMapName,
      "/raid/profile/list": this.raidProfileList,
      "/raid/profile/save": this.raidProfileSave,
      "/server/config/accounts": this.serverConfigAccounts,
      "/server/config/gameplay": this.serverConfigGameplay,
      "/server/config/mods": this.serverConfigMods,
      "/server/config/profiles": this.serverConfigProfiles,
      "/server/config/server": this.serverConfigServer,
      "/server/softreset": this.serverSoftReset,
      "/singleplayer/bundles": this.singleplayerBundles,
      "/singleplayer/settings/raid/endstate": this.singleplayerSettingsRaidEndstate,
      "/singleplayer/settings/raid/menu": this.singleplayerSettingsRaidMenu,
      "/singleplayer/settings/bot/difficulty": this.singleplayerSettingsBotDifficulty,
    };
    this.dynamicResponses = {
      "/client/locale": this.dynClientLocale,
      "/client/menu/locale": this.dynClientMenuLocale,
      "/client/location/getLocalloot": this.dynClientLocationGetLocalloot,
      "/client/trading/api/getUserAssortPrice/trader": this.dynClientTradingApiGetUserAssortPriceTrader,
      "/client/trading/api/getTraderAssort": this.dynClientTradingApiGetTraderAssort,
      "/client/trading/api/getTrader": this.dynClientTradingApiGetTrader,
      "/client/trading/customization": this.dynClientTradingCustomization,
      "server/profile": this.dynServerProfile,
      "singleplayer/settings/bot/difficulty": this.dynSingleplayerSettingsBotDifficulty,
      "singleplayer/settings/bot/limit": this.dynSingleplayerSettingsBotLimit,
      "singleplayer/settings/defaultRaidSettings": this.dynSingleplayerSettingsDefaultRaidSettings,
      "singleplayer/settings/weapon/durability": this.dynSingleplayerSettingsWeaponDurability,
      "push/notifier/get": this.dynPushNotifierGet,
      notifierBase: this.dynNotifierBase,
      notifierServer: this.dynNotifierServer,
      "api/location": this.dynApiLocation,
      bundle: this.dynBundle,
      jpg: this.dynImageJpg,
      png: this.dynImagePng,
      last_id: this.dynlast_id,
    };
  }
  //dynamic
  dynApiLocation(url, info, sessionID) {
    // if (url.includes("factory4_day")) { return response_f.noBody(fileIO.readParsed(db.locations_test.factory4_day1).Location); }
    return response_f.noBody(location_f.handler.get(url.replace("/api/location/", ""), sessionID));
  }
  dynClientLocale(url, info, sessionID) {
    return response_f.getBody(locale_f.handler.getGlobal(url.replace("/client/locale/", "")));
  }
  dynClientLocationGetLocalloot(url, info, sessionID) {
    let location_name = "";
    const params = new URL("https://127.0.0.1" + url).searchParams;
    if (typeof info.locationId != "undefined") {
      location_name = info.locationId;
    } else {
      location_name = params.get("locationId");
    }

    return response_f.getBody(location_f.handler.get(location_name));
  }
  dynClientMenuLocale(url, info, sessionID) {
    return response_f.getBody(locale_f.handler.getMenu(url.replace("/client/menu/locale/", "")));
  }
  dynClientTradingApiGetTrader(url, info, sessionID) {
    let TraderID = url.split("/");
    TraderID = TraderID[TraderID.length - 1];
    return response_f.getBody(trader_f.handler.getTrader(TraderID, sessionID));
  }
  dynClientTradingApiGetTraderAssort(url, info, sessionID) {
    let TraderID = url.split("/");
    TraderID = TraderID[TraderID.length - 1];
    return response_f.getBody(trader_f.handler.getAssort(sessionID, TraderID));
  }
  dynClientTradingApiGetUserAssortPriceTrader(url, info, sessionID) {
    return response_f.getBody(trader_f.handler.getPurchasesData(url.substr(url.lastIndexOf("/") + 1), sessionID));
  }
  dynClientTradingCustomization(url, info, sessionID) {
    let splittedUrl = url.split("/");
    let traderID = splittedUrl[splittedUrl.length - 2];
    return response_f.getBody(trader_f.handler.getCustomization(traderID, sessionID));
  }
  dynBundle() {
    return "BUNDLE";
  }
  dynImageJpg() {
    return "IMAGE";
  }
  dynImagePng() {
    return "IMAGE";
  }
  dynlast_id() {
    return "NOTIFY";
  }
  dynNotifierServer() {
    return "NOTIFY";
  }
  dynNotifierBase(url, info, sessionID) {
    return response_f.emptyArrayResponse();
  }
  dynPushNotifierGet(url, info, sessionID) {
    return response_f.emptyArrayResponse();
  }
  dynServerProfile(url, info, sessionID) {
    let myID = url.replace("/server/profile/pmc", "").replace("/server/profile/scav", "");
    return response_f.getBody(profile_f.handler.getProfileById(myID));
  }
  dynSingleplayerSettingsBotDifficulty(url, info, sessionID) {
    const splittedUrl = url.split("/");
    const type = splittedUrl[splittedUrl.length - 2].toLowerCase();
    const difficulty = splittedUrl[splittedUrl.length - 1];
    process.stdout.write(`${type}[${difficulty}] `);
    return response_f.noBody(bots_f.getBotDifficulty(type, difficulty));
  }
  dynSingleplayerSettingsBotLimit(url, info, sessionID) {
    const splittedUrl = url.split("/");
    const type = splittedUrl[splittedUrl.length - 1];
    return response_f.noBody(bots_f.getBotLimit(type));
  }
  dynSingleplayerSettingsDefaultRaidSettings(url, info, sessionID) {
    return response_f.noBody(global._database.gameplayConfig.defaultRaidSettings);
  }
  dynSingleplayerSettingsWeaponDurability(url, info, sessionID) {
    return response_f.noBody(global._database.gameplayConfig.inraid.saveWeaponDurability);
  }

  //static
  clientAccountCustomization(url, info, sessionID) {
    return response_f.getBody(customization_f.getAccountCustomization());
  }
  clientChatServerList(url, info, sessionID) {
    return response_f.getBody([
      {
        _id: "5ae20a0dcb1c13123084756f",
        RegistrationId: 20,
        DateTime: Math.floor(new Date() / 1000),
        IsDeveloper: true,
        Regions: ["EUR"],
        VersionId: "bgkidft87ddd",
        Ip: "",
        Port: 0,
        Chats: [{ _id: "0", Members: 0 }],
      },
    ]);
  }
  clientCheckVersion(url, info, sessionID) {
    return response_f.getBody({ isvalid: true, latestVersion: "" });
  }
  clientCustomization(url, info, sessionID) {
    return response_f.getBody(customization_f.getCustomization());
  }
  clientFriendList(url, info, sessionID) {
    return response_f.getBody({ Friends: [], Ignore: [], InIgnoreList: [] });
  }
  clientFriendRequestListInbox(url, info, sessionID) {
    return response_f.emptyArrayResponse();
  }
  clientFriendRequestListOutbox(url, info, sessionID) {
    return response_f.emptyArrayResponse();
  }
  clientFriendRequestSend(url, info, sessionID) {
    return response_f.noBody({
      requestId: "¯\\_(ツ)_/¯",
      retryAfter: 0,
      status: 0,
    });
  }
  clientGameBotGenerate(url, info, sessionID) {
    return response_f.getBody(bots_f.generate(info, sessionID));
  }
  clientGameConfig(url, info, sessionID) {
    let obj = {
      queued: false,
      banTime: 0,
      hash: "BAN0",
      lang: "en",
      ndaFree: false,
      reportAvailable: true,
      languages: {},
      aid: sessionID,
      token: sessionID,
      taxonomy: 6,
      activeProfileId: "pmc" + sessionID,
      nickname: "user",
      backend: {
        Trading: server.getBackendUrl(),
        Messaging: server.getBackendUrl(),
        Main: server.getBackendUrl(),
        RagFair: server.getBackendUrl(),
      },
      totalInGame: 0,
      utc_time: utility.getTimestamp(),
    };
    let languages = locale_f.handler.getLanguages().data;
    for (let index in languages) {
      let lang = languages[index];
      obj.languages[lang.ShortName] = lang.Name;
    }
    return response_f.getBody(obj);
  }
  clientGameKeepalive(url, info, sessionID) {
    if (typeof sessionID == "undefined")
      return response_f.getBody({
        msg: "No Session",
        utc_time: utility.getTimestamp(),
      });
    keepalive_f.main(sessionID);
    return response_f.getBody({ msg: "OK", utc_time: utility.getTimestamp() });
  }
  clientGameLogout(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientGameProfileCreate(url, info, sessionID) {
    profile_f.handler.createProfile(info, sessionID);
    return response_f.getBody({ uid: "pmc" + sessionID });
  }
  clientGameProfileItemsMoving(url, info, sessionID) {
    const data = item_f.handler.handleRoutes(info, sessionID);
    return response_f.getBody(data);
  }
  clientGameProfileList(url, info, sessionID) {
    // the best place to update health because its where profile is updating in client also!!!
    if (!account_f.handler.isWiped(sessionID) && profile_f.handler.profileAlreadyCreated(sessionID)) {
      health_f.handler.healOverTime(profile_f.handler.getPmcProfile(sessionID), info, sessionID);
    }

    return response_f.getBody(profile_f.handler.getCompleteProfile(sessionID));
  }
  clientGameProfileNicknameChange(url, info, sessionID) {
    let output = profile_f.handler.changeNickname(info, sessionID);

    if (output == "taken") {
      return response_f.getBody(null, 255, serverConfig.translations.alreadyInUse);
    }

    if (output == "tooshort") {
      return response_f.getBody(null, 256, serverConfig.translations.tooShort);
    }

    return response_f.getBody({
      status: 0,
      nicknamechangedate: Math.floor(new Date() / 1000),
    });
  }
  clientGameProfileNicknameReserved(url, info, sessionID) {
    return response_f.getBody(account_f.handler.getReservedNickname(sessionID));
  }
  clientGameProfileNicknameValidate(url, info, sessionID) {
    let output = profile_f.handler.validateNickname(info, sessionID);

    if (output == "taken") {
      return response_f.getBody(null, 255, serverConfig.translations.alreadyInUse);
    }

    if (output == "tooshort") {
      return response_f.getBody(null, 256, serverConfig.translations.tooShort);
    }

    return response_f.getBody({ status: "ok" });
  }
  clientGameProfileSavageRegenerate(url, info, sessionID) {
    return response_f.getBody([profile_f.handler.generateScav(sessionID)]);
  }
  clientGameProfileSearch(url, info, sessionID) {
    let ids = Object.keys(account_f.handler.accounts).filter((x) => x != sessionID);
    let users = [];
    for (let i in ids) {
      let id = ids[i];
      if (!fileIO.exist(`user/profiles/${id}/character.json`)) continue;
      let character = fileIO.readParsed(`user/profiles/${id}/character.json`);
      if (!character.Info.Nickname || !character.Info.Nickname.toLowerCase().includes(info.nickname.toLowerCase())) continue;
      let obj = { Info: {} };
      obj._id = character.aid;
      obj.Info.Nickname = character.Info.Nickname;
      obj.Info.Side = character.Info.Side;
      obj.Info.Level = character.Info.Level;
      obj.Info.MemberCategory = character.Info.MemberCategory;
      obj.Info.Ignored = false;
      obj.Info.Banned = false;
      users.push(obj);
    }

    return response_f.getBody(users);
  }
  clientGameProfileSelect(url, info, sessionID) {
    return response_f.getBody({
      status: "ok",
      notifier: {
        server: server.getBackendUrl() + "/",
        channel_id: "testChannel",
        url: "",
        notifierServer: "",
        ws: "",
      },
      notifierServer: "",
    });
  }
  clientGameProfileVoiceChange(url, info, sessionID) {
    profile_f.handler.changeVoice(info, sessionID);
    return response_f.nullResponse();
  }
  clientGameStart(url, info, sessionID) {
    let accounts = account_f.handler.getList();
    for (let account in accounts) {
      if (account == sessionID) {
        if (!fileIO.exist("user/profiles/" + sessionID + "/character.json")) logger.logWarning("New account login!");
        return response_f.getBody(null, 0, null);
      }
    }
    return response_f.getBody(null, 999, "Profile Not Found!!");
  }
  clientGameVersionValidate(url, info, sessionID) {
    logger.logInfo("User connected with client version " + info.version.major);
    return response_f.nullResponse();
  }
  clientGetMetricsConfig(url, info, sessionID) {
    return response_f.getBody(fileIO.readParsed(db.base.matchMetrics));
  }
  clientGlobals(url, info, sessionID) {
    global._database.globals.time = Date.now() / 1000;
    return response_f.getBody(global._database.globals);
  }
  clientHandbookBuildsMyList(url, info, sessionID) {
    return response_f.getBody(weaponbuilds_f.getUserBuilds(sessionID));
  }
  clientHandbookTemplates(url, info, sessionID) {
    return response_f.getBody(global._database.templates);
  }
  clientHideoutAreas(url, info, sessionID) {
    // TODO: from _database
    return response_f.getBody(global._database.hideout.areas);
  }
  clientHideoutProductionRecipes(url, info, sessionID) {
    return response_f.getBody(global._database.hideout.production);
  }
  clientHideoutProductionScavcaseRecipes(url, info, sessionID) {
    return response_f.getBody(global._database.hideout.scavcase);
  }
  clientHideoutSettings(url, info, sessionID) {
    return response_f.getBody(global._database.hideout.settings);
  }
  clientInsuranceItemsListCost(url, info, sessionID) {
    return response_f.getBody(insurance_f.cost(info, sessionID));
  }
  clientItems(url, info, sessionID) {
    return response_f.getBody(global._database.items);
  }
  clientItemsPrices(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientLanguages(url, info, sessionID) {
    return response_f.noBody(locale_f.handler.getLanguages());
  }
  clientLocations(url, info, sessionID) {
    return response_f.getBody(location_f.handler.generateAll());
  }
  clientMailDialogGetAllAttachments(url, info, sessionID) {
    return response_f.getBody(dialogue_f.handler.getAllAttachments(info.dialogId, sessionID));
  }
  clientMailDialogInfo(url, info, sessionID) {
    return response_f.getBody(dialogue_f.handler.getDialogueInfo(info.dialogId, sessionID));
  }
  clientMailDialogList(url, info, sessionID) {
    return dialogue_f.handler.generateDialogueList(sessionID);
  }
  clientMailDialogPin(url, info, sessionID) {
    dialogue_f.handler.setDialoguePin(info.dialogId, true, sessionID);
    return response_f.emptyArrayResponse();
  }
  clientMailDialogRead(url, info, sessionID) {
    dialogue_f.handler.setRead(info.dialogs, sessionID);
    return response_f.emptyArrayResponse();
  }
  clientMailDialogRemove(url, info, sessionID) {
    dialogue_f.handler.removeDialogue(info.dialogId, sessionID);
    return response_f.emptyArrayResponse();
  }
  clientMailDialogUnpin(url, info, sessionID) {
    dialogue_f.handler.setDialoguePin(info.dialogId, false, sessionID);
    return response_f.emptyArrayResponse();
  }
  clientMailDialogView(url, info, sessionID) {
    return dialogue_f.handler.generateDialogueView(info.dialogId, sessionID);
  }
  clientMatchAvailable(url, info, sessionID) {
    let output = match_f.handler.getEnabled();

    if (output === false) {
      return response_f.getBody(null, 999, "Offline mode enabled, if you are a server owner please change that in gameplay settings");
    }

    return response_f.getBody(output);
  }
  clientMatchExit(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientMatchGroupCreate(url, info, sessionID) {
    return response_f.getBody(match_f.handler.createGroup(sessionID, info));
  }
  clientMatchGroupDelete(url, info, sessionID) {
    return response_f.getBody(match_f.handler.createGroup(sessionID, info));
  }
  clientMatchGroupExit_From_Menu(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientMatchGroupInviteAccept(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientMatchGroupInviteCancel(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientMatchGroupInviteSend(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientMatchGroupLookingStart(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientMatchGroupLookingStop(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientMatchGroupStart_Game(url, info, sessionID) {
    return response_f.getBody(match_f.handler.joinMatch(info, sessionID));
  }
  clientMatchGroupStatus(url, info, sessionID) {
    return response_f.getBody(match_f.handler.getGroupStatus(info));
  }
  clientMatchJoin(url, info, sessionID) {
    return response_f.getBody(match_f.handler.joinMatch(info, sessionID));
  }
  clientMatchOfflineStart(url, info, sessionID) {
    /*
			{
			  locationName: 'Factory',
			  entryPoint: 'Factory',
			  startTime: 1626554822,
			  dateTime: 'CURR',
			  gameSettings: {
				timeAndWeatherSettings: { isRandomTime: false, isRandomWeather: false },
				botsSettings: { isEnabled: false, isScavWars: false, botAmount: 'AsOnline' },
				wavesSettings: {
				  botDifficulty: 'AsOnline',
				  isBosses: true,
				  isTaggedAndCursed: false,
				  wavesBotAmount: 'AsOnline'
				}
			  }
			}
		*/
    offraid_f.handler.addPlayer(sessionID, {
      Location: info.locationName,
      Time: info.dateTime,
    });
    return response_f.getBody(null);
  }
  clientMatchOfflineEnd(url, info, sessionID) {
    return response_f.getBody(null);
  }
  clientMatchUpdatePing(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientNotifierChannelCreate(url, info, sessionID) {
    return response_f.getBody({
      notifier: {
        server: `${server.getBackendUrl()}/`,
        channel_id: "testChannel",
        url: `${server.getBackendUrl()}/notifierServer/get/${sessionID}`,
      },
      notifierServer: `${server.getBackendUrl()}/notifierServer/get/${sessionID}`,
    });
  }
  clientProfileStatus(url, info, sessionID) {
    return response_f.getBody([
      {
        profileid: "scav" + sessionID,
        status: "Free",
        sid: "",
        ip: "",
        port: 0,
      },
      {
        profileid: "pmc" + sessionID,
        status: "Free",
        sid: "",
        ip: "",
        port: 0,
      },
    ]);
  }
  clientPutMetrics(url, info, sessionID) {
    return response_f.nullResponse();
  }
  clientQuestList(url, info, sessionID) {
    return response_f.getBody(quest_f.getQuestsForPlayer(url, info, sessionID));
  }
  clientRagfairFind(url, info, sessionID) {
    return response_f.getBody(ragfair_f.getOffers(sessionID, info));
  }
  clientRagfairItemMarketPrice(url, info, sessionID) {
    return response_f.getBody(ragfair_f.itemMarKetPrice(info));
  }
  clientRagfairSearch(url, info, sessionID) {
    return response_f.getBody(ragfair_f.getOffers(sessionID, info));
  }
  clientServerList(url, info, sessionID) {
    return response_f.getBody([{ ip: server.getIp(), port: server.getPort() }]);
  }
  clientSettings(url, info, sessionID) {
    return response_f.getBody(fileIO.readParsed("./db/base/client.settings.json"));
  }
  clientTradingApiGetTradersList(url, info, sessionID) {
    return response_f.getBody(trader_f.handler.getAllTraders(sessionID));
  }
  clientTradingApiTraderSettings(url, info, sessionID) {
    return response_f.getBody(trader_f.handler.getAllTraders(sessionID));
  }
  clientTradingCustomizationStorage(url, info, sessionID) {
    return fileIO.read(customization_f.getPath(sessionID));
  }
  clientWeather(url, info, sessionID) {
    return response_f.getBody(weather_f.generate());
  }

  launcherProfileChangeEmail(url, info, sessionID) {
    let output = account_f.handler.changeEmail(info);
    return output === "" ? "FAILED" : "OK";
  }
  launcherProfileChangePassword(url, info, sessionID) {
    let output = account_f.handler.changePassword(info);
    return output === "" ? "FAILED" : "OK";
  }
  launcherProfileChangeWipe(url, info, sessionID) {
    let output = account_f.handler.wipe(info);
    return output === "" ? "FAILED" : "OK";
  }
  launcherProfileGet(url, info, sessionID) {
    let accountId = account_f.handler.login(info);
    let output = account_f.handler.find(accountId);
    return fileIO.stringify(output);
  }
  launcherProfileLogin(url, info, sessionID) {
    let output = account_f.handler.login(info);
    return output === "" ? "FAILED" : output;
  }
  launcherProfileRegister(url, info, sessionID) {
    let output = account_f.handler.register(info);
    return output !== "" ? "FAILED" : "OK";
  }
  launcherProfileRemove(url, info, sessionID) {
    let output = account_f.handler.remove(info);
    return output === "" ? "FAILED" : "OK";
  }
  launcherServerConnect(url, info, sessionID) {
    return fileIO.stringify({
      backendUrl: server.getBackendUrl(),
      name: server.getName(),
      editions: Object.keys(db.profile),
    });
  }

  modeOffline(url, info, sessionID) {
    return response_f.noBody(serverConfig.offline);
  }
  playerHealthEvents(url, info, sessionID) {
    health_f.handler.updateHealth(info, sessionID);
    return response_f.nullResponse();
  }
  playerHealthSync(url, info, sessionID) {
    let pmcData = profile_f.handler.getPmcProfile(sessionID);
    health_f.handler.saveHealth(pmcData, info, sessionID);
    return response_f.nullResponse();
  }
  raidMapName(url, info, sessionID) {
    return offraid_f.handler.addPlayer(sessionID, info);
  }
  raidProfileList(url, info, sessionID) {
    return response_f.getBody(match_f.handler.getProfile(info));
  }
  raidProfileSave(url, info, sessionID) {
    offraid_f.saveProgress(info, sessionID);
    return response_f.nullResponse();
  }
  serverConfigAccounts(url, body, sessionID) {
    home_f.processSaveAccountsData(body, db.user.configs.accounts);
    return home_f.RenderAccountsConfigPage("/server/config/accounts");
  }
  serverConfigGameplay(url, body, sessionID) {
    //execute data save here with info cause info should be $_GET transfered to json type with info[variableName]
    home_f.processSaveData(body, db.user.configs.gameplay);
    return home_f.RenderGameplayConfigPage("/server/config/gameplay");
  }
  serverConfigMods(url, body, sessionID) {
    home_f.processSaveModData(body, global.internal.resolve("user/configs/mods.json"));
    return home_f.RenderModsConfigPage("/server/config/mods");
  }
  serverConfigProfiles(url, body, sessionID) {
    return home_f.renderPage();

    //Load Profiles from profile folder and allow user for few changes for them

    //home_f.processSaveData(body, db.user.configs.gameplay);
    //return home_f.RenderGameplayConfigPage("/server/config/gameplay");
  }
  serverConfigServer(url, body, sessionID) {
    home_f.processSaveServerData(body, db.user.configs.server);
    return home_f.RenderServerConfigPage("/server/config/server");
  }
  serverSoftReset(url, body, sessionID) {
    global.server.softRestart();
    return { status: "OK" };
  }
  singleplayerBundles(url, info, sessionID) {
    let local = serverConfig.ip === "127.0.0.1";
    return response_f.noBody(bundles_f.handler.getBundles(local));
  }
  singleplayerSettingsRaidEndstate(url, info, sessionID) {
    return response_f.noBody(global._database.gameplayConfig.inraid.miaOnTimerEnd);
  }
  singleplayerSettingsRaidMenu(url, info, sessionID) {
    return response_f.noBody(global._database.gameplayConfig.defaultRaidSettings);
  }
  singleplayerSettingsBotDifficulty(url, info, sessionID) {
    let data = [];
    for (const botType in global._database.bots) {
      for (const difficulty in global._database.bots[botType].difficulty) {
        const key = `${difficulty}.${botType}`;
        data.push({
          Key: key,
          Value: global._database.bots[botType].difficulty[difficulty],
        });
      }
    }
    return response_f.noBody(data);
    //bots_f.getBotDifficulty(type, difficulty)
  }
}
module.exports.responses = new Responses();
