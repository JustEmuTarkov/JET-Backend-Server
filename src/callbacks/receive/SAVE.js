exports.execute = (sessionID, req, resp, body, output) => {
    if (global._Database.gameplayConfig.autosave.saveOnReceive) {
        savehandler_f.saveOpenSessions();
    }
}