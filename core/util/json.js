"use strict";

const fs = require('fs');

function createDir(file) {    
    let filePath = file.substr(0, file.lastIndexOf('/'));

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
}

function stringify(data, oneLiner = false) {
	if(oneLiner)
		return JSON.stringify(data);
    return JSON.stringify(data, null, "\t");
}

exports.createReadStream = (file) => { return fs.createReadStream(file); }

exports.readParsed = (file) => { return JSON.parse(fs.readFileSync(file, 'utf8')); }

exports.parse = (string) => { return JSON.parse(string); }

exports.read = (file) => { return fs.readFileSync(file, 'utf8'); }

exports.exist = (file) => { return fs.existsSync(file); }

exports.readDir = (path) => { return fs.readdirSync(path); }

exports.statSync = (path) => { return fs.statSync(path); }

exports.lstatSync = (path) => { return fs.lstatSync(path); }

exports.unlink = (path) => { return fs.unlinkSync(path); }

exports.rmDir = (path) => { return fs.rmdirSync(path); }

exports.mkDir = (path) => { return fs.mkdirSync(path); }

exports.write = (file, data, raw = false) => {
	if(file.indexOf('/') != -1)
		createDir(file);
	if(raw)
	{
		fs.writeFileSync(file, data);
		return;
	}
    fs.writeFileSync(file, stringify(data), 'utf8');
}

module.exports.stringify = stringify;