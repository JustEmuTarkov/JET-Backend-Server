exports.execute = (sessionID, req, resp, body, output) => {
    if (gameplayConfig.autosave.saveOnReceive) {
        saveHandler_f.saveOpenSessions();
    }
}