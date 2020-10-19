exports.execute = (sessionID, req, resp, body, output) => {
    if (gameplayConfig.autosave.saveOnReceive) {
        savehandler_f.saveOpenSessions();
    }
}