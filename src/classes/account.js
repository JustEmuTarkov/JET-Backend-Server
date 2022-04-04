"use strict";

/**
 * AccountServer class maintains list of accounts in memory. All account information should be
 * loaded during server init.
 */
class AccountServer {
  constructor() {
    this.accounts = {};
  }

  initialize() {
    const profileIDs = fileIO.readDir("./user/profiles");
    let accountsData = {};
    for (let id in profileIDs) {
	if(!fileIO.exist(`./user/profiles/${profileIDs[id]}/account.json`)) continue;
      accountsData[profileIDs[id]] = fileIO.readParsed(`./user/profiles/${profileIDs[id]}/account.json`);
    }
    this.accounts = accountsData;
  }

  getList() {
    return this.accounts;
  }

  saveToDisk(toSaveId = 0) {
    if (toSaveId == 0) {
      for (let id in this.accounts) {
        fileIO.write(`./user/profiles/${id}/account.json`, this.accounts[id]);
      }
      logger.logInfo(`Saved all account data`);
    } else {
      fileIO.write(`./user/profiles/${toSaveId}/account.json`, this.accounts[toSaveId]);
      logger.logInfo(`Saved account data for: ${toSaveId}`);
    }
  }

  find(sessionID) {
    for (let accountID in this.accounts) {
      let account = this.accounts[accountID];

      if (account.id === sessionID) {
        return account;
      }
    }

    return undefined;
  }
  
  getAccountLang(sessionID) {
    let account = this.find(sessionID);
    if(typeof account.lang == "undefined"){
      account.lang = "en";
      this.saveToDisk(sessionID);
    }
    return account.lang;
  }

  isWiped(sessionID) {
    return this.accounts[sessionID].wipe;
  }

  setWipe(sessionID, state) {
    this.accounts[sessionID].wipe = state;
  }

  login(info) {
    for (let accountID in this.accounts) {
      let account = this.accounts[accountID];

      if (info.email === account.email && info.password === account.password) {
        return accountID;
      }
    }

    return "";
  }

  register(info) {
    for (let accountID in this.accounts) {
      if (info.email === this.accounts[accountID].email) {
        return accountID;
      }
    }

    let accountID = utility.generateNewAccountId();

    this.accounts[accountID] = {
      id: accountID,
      email: info.email,
	  //nickname: "",
      password: info.password,
      wipe: true,
      edition: info.edition,
    };

    this.saveToDisk(accountID);
    return "";
  }

  remove(info) {
    let accountID = this.login(info);

    if (accountID !== "") {
      delete this.accounts[accountID];
      utility.removeDir(`user/profiles/${accountID}/`);
      //this.saveToDisk();
    }

    return accountID;
  }

  changeEmail(info) {
    let accountID = this.login(info);

    if (accountID !== "") {
      this.accounts[accountID].email = info.change;
      this.saveToDisk(accountID);
    }

    return accountID;
  }

  changePassword(info) {
    let accountID = this.login(info);

    if (accountID !== "") {
      this.accounts[accountID].password = info.change;
      this.saveToDisk(accountID);
    }

    return accountID;
  }

  wipe(info) {
    let accountID = this.login(info);

    if (accountID !== "") {
      this.accounts[accountID].edition = info.edition;
      this.setWipe(accountID, true);
      this.saveToDisk(accountID);
    }

    return accountID;
  }

  getReservedNickname(sessionID) {
    return "";
  }

  nicknameTaken(info) {
    // for (let accountID in this.accounts) {
      // if (info.nickname.toLowerCase() === this.accounts[accountID].nickname.toLowerCase()) {
        // return true;
      // }
    // }

    return false;
  }
}

function getPath(sessionID) {
  return `user/profiles/${sessionID}/`;
}

module.exports.handler = new AccountServer();
module.exports.getPath = getPath;
