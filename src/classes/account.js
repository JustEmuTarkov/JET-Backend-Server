"use strict";

/**
 * AccountServer class maintains list of accounts in memory. All account information should be
 * loaded during server init.
 */
class AccountServer {
  constructor() {
    this.accounts = {};
    this.accountFileAge = {};
  }

  initialize() {
    // DEPRECATED !!!!

    // const profileIDs = fileIO.readDir("./user/profiles");
    // let accountsData = {};
    // for (let id in profileIDs) {
	  //   if(!fileIO.exist(`./user/profiles/${profileIDs[id]}/account.json`)) continue;
    //   accountsData[profileIDs[id]] = fileIO.readParsed(`./user/profiles/${profileIDs[id]}/account.json`);
    // }
    // this.accounts = accountsData;
  }

  getList() {
    return this.accounts;
  }
  /**
   * reloadAccountByLogin functions checks for changes in profile account data on user login and loads accounts on demand.
   * @param {*} info 
   * @returns user account ID
   */
  reloadAccountByLogin(info) {
    /**
     * Read account files from cache that were already loaded by the second part of this function.
     * If the file was changed (for example, by another cluster member), the account file gets reloaded from disk.
     */
    for (let accountID in this.accounts) {
      let account = this.accounts[accountID];

      // Does the account information match any cached account?
      if (info.email === account.email && info.password === account.password) {
        // Check if the file was modified by another cluster member using the file age.
        let stats = global.internal.fs.statSync(`./user/profiles/${accountID}/account.json`);
        if (stats.mtimeMs != this.accountFileAge[accountID]) {
          logger.logWarning(`[CLUSTER] Account file for account ${accountID} was modified, reloading.`);
          // Reload the account from disk.
          this.accounts[accountID] = fileIO.readParsed(`./user/profiles/${accountID}/account.json`);
          // Reset the file age for this users account file.
          this.accountFileAge[accountID] = stats.mtimeMs;
        }

        return accountID;
      }
    }

    /**
     * Read account files from disk for accounts that are not cached already.
     */
    const profileIDs = fileIO.readDir("./user/profiles");
    for (let id in profileIDs) {
      if (!fileIO.exist(`./user/profiles/${profileIDs[id]}/account.json`)) {
        logger.logWarning(`[CLUSTER] Account file for account ${profileIDs[id]} does not exist.`);
      } else {

        // Read all account files from disk as we need to compare the login data.
        let account = fileIO.readParsed(`./user/profiles/${profileIDs[id]}/account.json`);
        if (info.email === account.email && info.password === account.password) {
          // Read the file age for this users account file.
          let stats = global.internal.fs.statSync(`./user/profiles/${profileIDs[id]}/account.json`);

          // Save the account to memory and set the accountFileAge variable.
          this.accounts[profileIDs[id]] = account
          this.accountFileAge[profileIDs[id]] = stats.mtimeMs;
          logger.logSuccess(`[CLUSTER] User ${account.email} with ID ${profileIDs[id]} logged in successfully.`);

          return profileIDs[id];
        }
      }
    }

    // If the account does not exist, this will allow the launcher to display an error message.
    return "";
  }

  /**
   * Reloads the account stored in memory for a specific session (aka. accountID), if the file was modified elsewhere.
   * @param {*} sessionID 
   */
   reloadAccountBySessionID(sessionID) {
    if (!fileIO.exist(`./user/profiles/${sessionID}/account.json`)) {
      logger.logWarning(`[CLUSTER] Account file for account ${sessionID} does not exist.`);
    } else {
      // Does the session exist?
      if (!this.accounts[sessionID]) {
        logger.logWarning(`[CLUSTER] Tried to load session ${sessionID} but it wasn't cached, loading.`);
        // Reload the account from disk.
        this.accounts[sessionID] = fileIO.readParsed(`./user/profiles/${sessionID}/account.json`);
        // Set the file age for this users account file.
        let stats = global.internal.fs.statSync(`./user/profiles/${sessionID}/account.json`);
        this.accountFileAge[sessionID] = stats.mtimeMs;
      } else {
        // Check if the file was modified by another cluster member using the file age.
        let stats = global.internal.fs.statSync(`./user/profiles/${sessionID}/account.json`);
        if (stats.mtimeMs != this.accountFileAge[sessionID]) {
          logger.logWarning(`[CLUSTER] Account file for account ${sessionID} was modified, reloading.`);

          // Reload the account from disk.
          this.accounts[sessionID] = fileIO.readParsed(`./user/profiles/${sessionID}/account.json`);
          // Reset the file age for this users account file.
          this.accountFileAge[sessionID] = stats.mtimeMs;
        }
      }
    }
  }

  /**
   * Check if the client has a profile. This function will be used by the response "/client/game/start" and determine, if a new profile will be created.
   * @param {*} sessionID 
   * @returns If the account exists.
   */
  clientHasProfile(sessionID) {
    this.reloadAccountBySessionID(sessionID)
    let accounts = this.getList();
    for (let account in accounts) {
      if (account == sessionID) {
        if (!fileIO.exist("user/profiles/" + sessionID + "/character.json")) logger.logSuccess(`[CLUSTER] New account ${sessionID} logged in!`);
        return true
      }
    }
    return false
  }

  /**
   * If the sessionID is specified, this function will save the specified account file to disk, if the file wasn't modified elsewhere and the current memory content differs from the content on disk.
   * @param {*} sessionID 
   */
  saveToDisk(sessionID = 0) {
    // Should all accounts be saved to disk?
    if (sessionID == 0) {
      // Iterate through all cached accounts.
      for (let id in this.accounts) {
        // Check if the file was modified by another cluster member using the file age.
        let stats = global.internal.fs.statSync(`./user/profiles/${id}/account.json`);
        if (stats.mtimeMs == this.accountFileAge[id]) {

          // Check if the memory content differs from the content on disk.
          let currentAccount = this.accounts[id];
          let savedAccount = fileIO.readParsed(`./user/profiles/${id}/account.json`);
          if (JSON.stringify(currentAccount) !== JSON.stringify(savedAccount)) {
            // Save memory content to disk.
            fileIO.write(`./user/profiles/${id}/account.json`, this.accounts[id]);

            // Update file age to prevent another reload by this server.
            let stats = global.internal.fs.statSync(`./user/profiles/${id}/account.json`);
            this.accountFileAge[id] = stats.mtimeMs;

            logger.logSuccess(`[CLUSTER] Account file for account ${id} was saved to disk.`);
          }
        } else {
          logger.logWarning(`[CLUSTER] Account file for account ${id} was modified, reloading.`);

          // Reload the account from disk.
          this.accounts[id] = fileIO.readParsed(`./user/profiles/${id}/account.json`);
          // Reset the file age for this users account file.
          this.accountFileAge[id] = stats.mtimeMs;
        }
      }
    } else {
      // Does the account file exist? (Required for new accounts)
      if (!fileIO.exist(`./user/profiles/${sessionID}/account.json`)) {
        // Save memory content to disk
        fileIO.write(`./user/profiles/${sessionID}/account.json`, this.accounts[sessionID]);

        // Update file age to prevent another reload by this server.
        let stats = global.internal.fs.statSync(`./user/profiles/${sessionID}/account.json`);
        this.accountFileAge[sessionID] = stats.mtimeMs;

        logger.logSuccess(`[CLUSTER] New account ${sessionID} registered and was saved to disk.`);
      } else {
        // Check if the file was modified by another cluster member using the file age.
        let stats = global.internal.fs.statSync(`./user/profiles/${sessionID}/account.json`);
        if (stats.mtimeMs == this.accountFileAge[sessionID]) {
          // Check if the memory content differs from the content on disk.
          let currentAccount = this.accounts[sessionID];
          let savedAccount = fileIO.readParsed(`./user/profiles/${sessionID}/account.json`);
          if (JSON.stringify(currentAccount) !== JSON.stringify(savedAccount)) {
            // Save memory content to disk
            fileIO.write(`./user/profiles/${sessionID}/account.json`, this.accounts[sessionID]);

            // Update file age to prevent another reload by this server.
            let stats = global.internal.fs.statSync(`./user/profiles/${sessionID}/account.json`);
            this.accountFileAge[sessionID] = stats.mtimeMs;

            logger.logSuccess(`[CLUSTER] Account file for account ${sessionID} was saved to disk.`);
          }
        } else {
          logger.logWarning(`[CLUSTER] Account file for account ${sessionID} was modified, reloading.`);

          // Reload the account from disk.
          this.accounts[sessionID] = fileIO.readParsed(`./user/profiles/${sessionID}/account.json`);
          // Reset the file age for this users account file.
          this.accountFileAge[sessionID] = stats.mtimeMs;
        }
      }
    }
  }

  /**
   * Tries to find account data in loaded account list if not present returns undefined
   * @param {*} sessionID 
   * @returns Account_data
   */
  find(sessionID) {
    // This needs to be at the top to check for changed accounts.
    this.reloadAccountBySessionID(sessionID);
    for (let accountID in this.accounts) {
      let account = this.accounts[accountID];

      if (account.id === sessionID) {
        return account;
      }
    }

    return undefined;
  }
  
  /**
   * Searches for account and tries to retrive the account language
   * @param {*} sessionID 
   * @returns string - Account language (en, ru...)
   */
  getAccountLang(sessionID) {
    // This needs to be at the top to check for changed accounts.
    this.reloadAccountBySessionID(sessionID);
    let account = this.find(sessionID);
    if (typeof account.lang == "undefined") {
      account.lang = "en";
      this.saveToDisk(sessionID);
    }
    return account.lang;
  }

  isWiped(sessionID) {
    // This needs to be at the top to check for changed accounts.
    this.reloadAccountBySessionID(sessionID);
    return this.accounts[sessionID].wipe;
  }

  setWipe(sessionID, state) {
    // This needs to be at the top to check for changed accounts.
    this.reloadAccountBySessionID(sessionID);
    this.accounts[sessionID].wipe = state;
  }

  login(info) {
    // Get existing account from memory or cache a new one.
    return this.reloadAccountByLogin(info);
  }

  register(info) {
    // Get existing account from memory or cache a new one.
    let accountID = this.reloadAccountByLogin(info)
    if (accountID) {
      return accountID
    }

    accountID = utility.generateNewAccountId();

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
    this.reloadAccountBySessionID(sessionID);
    return "";
  }

  nicknameTaken(info) {
    // this will be usefull if you dont want to have same nicknames in accounts info otherwise leave it to always false
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
