exports.load = () => {
    serverConfig.rebuildCache = false;
    json.write("user/configs/server.json", serverConfig);
}