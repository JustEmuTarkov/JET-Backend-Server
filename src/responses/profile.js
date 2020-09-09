"use strict";

function createProfile(url, info, sessionID) {
    profile_f.profileServer.createProfile(info, sessionID);
    return response_f.getBody({"uid": "pmc" + sessionID});
}

function getProfileData(url, info, sessionID) {
    return response_f.getBody(profile_f.profileServer.getCompleteProfile(sessionID));
}

function regenerateScav(url, info, sessionID) {
    return response_f.getBody([profile_f.profileServer.generateScav(sessionID)]);
}

function changeVoice(url, info, sessionID) {
    profile_f.profileServer.changeVoice(info, sessionID);
    return response_f.nullResponse();
}

function changeNickname(url, info, sessionID) {
    let output = profile_f.profileServer.changeNickname(info, sessionID);
    
    if (output == "taken") {
        return response_f.getBody(null, 255, serverConfig.translations.alreadyInUse)
    }

    if (output == "tooshort") {
        return response_f.getBody(null, 256, serverConfig.translations.tooShort)
    }
    
    return response_f.getBody({"status": 0, "nicknamechangedate": Math.floor(new Date() / 1000)});
}

function validateNickname(url, info, sessionID) {
    let output = profile_f.profileServer.validateNickname(info, sessionID);
    
    if (output == "taken") {
        return response_f.getBody(null, 255, serverConfig.translations.alreadyInUse)
    }

    if (output == "tooshort") {
        return response_f.getBody(null, 256, serverConfig.translations.tooShort)
    }
    
    return response_f.getBody({"status": "ok"});
}

function getReservedNickname(url, info, sessionID) {
    return response_f.getBody(account_f.accountServer.getReservedNickname(sessionID));
}

function getServerProfile(url, info, sessionID) {
	let myID = url.replace("/server/profile/pmc", "").replace("/server/profile/scav","");
	return response_f.getBody(profile_f.profileServer.getProfileById(myID));
}

router.addDynamicRoute("/server/profile", getServerProfile);
router.addStaticRoute("/client/game/profile/create", createProfile);
router.addStaticRoute("/client/game/profile/list", getProfileData);
router.addStaticRoute("/client/game/profile/savage/regenerate", regenerateScav);
router.addStaticRoute("/client/game/profile/voice/change", changeVoice);
router.addStaticRoute("/client/game/profile/nickname/change", changeNickname);
router.addStaticRoute("/client/game/profile/nickname/validate", validateNickname);
router.addStaticRoute("/client/game/profile/nickname/reserved", getReservedNickname);
