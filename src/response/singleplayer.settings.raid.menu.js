exports.execute = (url, info, sessionID) => {
    return response_f.noBody({
            "aiAmount": "AsOnline",
            "aiDifficulty": "AsOnline",
            "bossEnabled": true,
            "scavWars": false,
            "taggedAndCursed": false
        });
}