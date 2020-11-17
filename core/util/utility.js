"use strict";
// getCookies
exports.getCookies = (req) => {
    let found = {};
    let cookies = req.headers.cookie;
    if (cookies) {
        for (let cookie of cookies.split(';')) {
            let parts = cookie.split('=');

            found[parts.shift().trim()] = decodeURI(parts.join('='));
        }
    }
    return found;
}
// clearString
exports.clearString = (s) => {
	return s.replace(/[\b]/g, '')
            .replace(/[\f]/g, '')
            .replace(/[\n]/g, '')
            .replace(/[\r]/g, '')
            .replace(/[\t]/g, '')
            .replace(/[\\]/g, '');
}
// getRandomInt
exports.getRandomInt = (min = 0, max = 100) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (max > min) ? Math.floor(Math.random() * (max - min + 1) + min) : min;
}
// getRandomIntEx
exports.getRandomIntEx = (max) => {
    return (max > 1) ? Math.floor(Math.random() * (max - 2) + 1) : 1;
}
// getDirList
exports.getDirList = (path) => {
    return json.readDir(path).filter(function(file) {
        return json.statSync(path + '/' + file).isDirectory();
    });
}
// removeDir
exports.removeDir = (dir) => {
    for (file of json.readDir(dir)) {
        let curPath = internal.path.join(dir, file);

        if (json.lstatSync(curPath).isDirectory()) {
            this.removeDir(curPath);
        } else {
            json.unlink(curPath);
        }
    }

    json.rmDir(dir);
}
// getServerUptimeInSeconds
exports.getServerUptimeInSeconds = () => {
    return Math.floor(internal.process.uptime());
}
// getTimestamp
exports.getTimestamp = () => {
    let time = new Date();
    return Math.floor(time.getTime() / 1000);
}
// getTime
exports.getTime = () => {
    return this.formatTime(new Date());
}
// formatTime
exports.formatTime = (date) => {
    let hours = ("0" + date.getHours()).substr(-2);
    let minutes = ("0" + date.getMinutes()).substr(-2);
    let seconds = ("0" + date.getSeconds()).substr(-2);
    return hours + "-" + minutes + "-" + seconds;
}
// getDate
exports.getDate = () => {
    return this.formatDate(new Date());
}
// formatDate
exports.formatDate = (date) => {
    let day = ("0" + date.getDate()).substr(-2);
    let month = ("0" + (date.getMonth() + 1)).substr(-2);
    return date.getFullYear() + "-" + month + "-" + day;
}
// makeSign
exports.makeSign = (Length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    
    for (let i = 0; i < Length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}
// generateNewAccountId
exports.generateNewAccountId = () => {
    return this.generateNewId("AID");
}
// generateNewItemId
exports.generateNewItemId = () => {
    return this.generateNewId("I");
}
// generateNewDialogueId
exports.generateNewDialogueId = () => {
    return this.generateNewId("D");
}
// generateNewId
exports.generateNewId = (prefix) => {
    let getTime = new Date();
    let month = getTime.getMonth().toString();
    let date = getTime.getDate().toString();
    let hour = getTime.getHours().toString();
    let minute = getTime.getMinutes().toString();
    let second = getTime.getSeconds().toString();
    let random = this.getRandomInt(1000000000, 9999999999).toString();
    let retVal = prefix + (month + date + hour + minute + second + random).toString();
    let sign = this.makeSign(24 - retVal.length).toString();
    return retVal + sign;
}
// secondsToTime
exports.secondsToTime = (timestamp) =>{
    timestamp = Math.round(timestamp);
    let hours = Math.floor(timestamp / 60 / 60);
    let minutes = Math.floor(timestamp / 60) - (hours * 60);
    let seconds = timestamp % 60;

    if( minutes < 10 ){ minutes = "0" + minutes}
    if( seconds < 10 ){ seconds = "0" + seconds}
    return hours + 'h' + minutes + ':' + seconds;
}
// isUndefined
exports.isUndefined = (dataToCheck) => {
	return typeof dataToCheck == "undefined";
}