"use strict";
var Zip = require('node-7z-forall');

class BaseUtils {
    constructor() {
        
    }
	
	async unZip(file, path){
		let archive = new Zip();
		archive.extractFull(file, `./${path}`, {
		  r: true // in subfolder too
		})
		.progress(function (files) {
		})
		.then(function () {
			logger.logSuccess("Archive unziped!!");
			return true;
		}).catch((e) => {
			logger.logError(e);
			return false;
		});
	}

}

module.exports.baseUtils = new BaseUtils();
