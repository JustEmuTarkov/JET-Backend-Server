"use strict";

exports.stringify = (data, oneLiner = false) => { return (oneLiner) ? JSON.stringify(data) : JSON.stringify(data, null, "\t"); }

exports.createReadStream = (file) => { return internal.fs.createReadStream(file); }

exports.createWriteStream = (file) => { return internal.fs.createWriteStream(file, {flags: 'w'}); }

exports.readParsed = (file) => { return JSON.parse(internal.fs.readFileSync(file, 'utf8')); }

exports.parse = (string) => { return JSON.parse(string); }

exports.read = (file) => { return internal.fs.readFileSync(file, 'utf8'); }

exports.exist = (file) => { return internal.fs.existsSync(file); }

exports.readDir = (path) => { return internal.fs.readdirSync(path); }

exports.statSync = (path) => { return internal.fs.statSync(path); }

exports.lstatSync = (path) => { return internal.fs.lstatSync(path); }

exports.unlink = (path) => { return internal.fs.unlinkSync(path); }

exports.rmDir = (path) => { return internal.fs.rmdirSync(path); }

exports.mkDir = (path) => { return internal.fs.mkdirSync(path); }

function createDir(file) {    
    let filePath = file.substr(0, file.lastIndexOf('/'));

    if (!internal.fs.existsSync(filePath)) {
        internal.fs.mkdirSync(filePath, { recursive: true });
    }
}

exports.write = (file, data, raw = false) => {
	if(file.indexOf('/') != -1)
		createDir(file);
	if(raw)
	{
		internal.fs.writeFileSync(file, JSON.stringify(data));
		return;
	}
    internal.fs.writeFileSync(file, JSON.stringify(data, null, "\t"), 'utf8');
}