const fs = require('fs');
const childProcess = require('child_process');
// LOAD LOCALLY
const UPX = require('./upx')('better');
const { compile } = require('./nexe');
var compressor = require('node-minify');

//to remove that strange console log go to node_modules/node-minify/lib/compressors/gcc.js line 66

// fix if nexe doesnt want to download itself on compiling
// node_modules/nexe/lib/compiler.js -> line 131 // change v.3.0.0 to v3.3.3


// dirs
const DIR_Core = "./core";
const DIR_CoreBackup = "./core-source-backup";
//const DIR_MinifiedCore = "./build/minified";
const DIR_MinifiedCore = "./build/minified";
const DIR_EXE_OUTPUT = "./build/Server";
const DIR_EXE_NotCompressed = "./build/Server_NotCompressed";
const DIR_EXE_Compressed = "./build/Server_Compiled";
const DIR_EXE_NotCompressed_ICON = "./build/Server_Compiled_Icon";
const DIR_ICON = './dev/res/icon.ico';

const ext_EXE = ".exe";

var ERROR = false;

let files = fs.readdirSync(DIR_Core);//get files to compress

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function minify_code(){
	return new Promise((resolve) => {
		try
		{
			for(let file of files){
				if(file.includes(".js")){
					compress(file);
				} else {
					let files_deep = fs.readdirSync(DIR_Core + "/" + file);
					for(let file_0 of files_deep){
						if(file_0.includes(".js")){
							compress(file_0, file);
						} else {
							console.log("file is too deep");
						}
					}
				}
			}
			function compress(file, deepnessFolder = ""){
				let path_ = (deepnessFolder != "")?"/"+deepnessFolder:"";
				console.log("compressing: " + DIR_Core + path_ + "/" + file);
				compressor.minify({
				  compressor: 'gcc',
				  input: DIR_Core + path_ + "/" + file,
				  output: DIR_MinifiedCore + path_ + "/" + file,
				  callback: function(err, min) {}
				});
			}
		} catch(exception) {
			console.log(exception);
			ERROR = true;
			resolve();
		}
		resolve();
	});
	
}
function renameFolders_1(){
	fs.rename(DIR_Core, DIR_CoreBackup, (err) => {
    if(err) {
        throw err;
    }
	fs.rename(DIR_MinifiedCore, DIR_Core, (err) => {
		if(err) {
			throw err;
		}
		
	});
});
}
function compileBuild(){
	return new Promise((resolve) => {
	compile({
		input: DIR_Core + 'main.js',
		output: DIR_EXE_NotCompressed,
		build: false,
		ico: DIR_ICON
	}).then(function(err) {
		console.log(" ");
		console.log("\x1b[32m√ Server Compiled!\x1b[0m");
		childProcess.execFile('./dev/bin/ResourceHacker.exe', [
			'-open',
			DIR_EXE_NotCompressed + ext_EXE,
			'-save',
			DIR_EXE_NotCompressed_ICON + ext_EXE,
			'-action',
			'addoverwrite',
			'-res',
			DIR_ICON,
			'-mask',
			'ICONGROUP,MAINICON,'
		], function(err) {
			//fs.unlinkSync('Server-Uncompressed.exe');
			console.log("\x1b[32m√ Icon Changed!\x1b[0m");
			UPX(DIR_EXE_NotCompressed_ICON + ext_EXE)
			.output(DIR_EXE_OUTPUT + ext_EXE)
			.start().then(function(stats) {
				console.log(stats);
				console.log("\x1b[32m√ Server Compressed!\x1b[0m");		

			}).finally(() => {
				resolve();
			}).catch(function (err) {
				console.log(err);
				reject();
			});
		});
	});
	});
}
function renameFolders_2(){
	fs.rename(DIR_Core, DIR_MinifiedCore, (err) => {
		if(err) {
			throw err;
		}
		fs.rename(DIR_CoreBackup, DIR_Core, (err) => {
			if(err) {
				throw err;
			}
			
		});
	});
}
function DrawSpacingHeader(text){
	console.log('============================================================');
	console.log(`=== | ${text} |`);
	console.log('============================================================');
}

async function main(){
	DrawSpacingHeader('Deleting old ' + DIR_MinifiedCore);

	if(fs.existsSync(DIR_MinifiedCore))
		fs.rmdirSync(DIR_MinifiedCore, { recursive: true }); // remove folder sync.

	DrawSpacingHeader('Minify the ' + DIR_Core);

	await minify_code();

	if(!ERROR)
	{
		DrawSpacingHeader('Preparing core for building');

		await renameFolders_1();

		console.log('============================================================');
		let i = 1;
		while(!fs.existsSync(DIR_Core)){
			console.log(`=== | Waiting [${i++}]`)
			await sleep(500);
		}
		console.log('============================================================');
		console.log('');
		DrawSpacingHeader('Deleting old server builds');

		if(fs.existsSync(DIR_EXE_OUTPUT + ext_EXE))
			fs.unlinkSync(DIR_EXE_OUTPUT + ext_EXE);	
		if(fs.existsSync(DIR_EXE_NotCompressed_ICON + ext_EXE))
			fs.unlinkSync(DIR_EXE_NotCompressed_ICON + ext_EXE);	
		if(fs.existsSync(DIR_EXE_NotCompressed + ext_EXE))
			fs.unlinkSync(DIR_EXE_NotCompressed + ext_EXE);	

		DrawSpacingHeader("\x1b[34m Starting Server Building!\x1b[0m");

		await compileBuild();

		DrawSpacingHeader("\x1b[32m√ Compilation Finished!\x1b[0m");

		while(!fs.existsSync(DIR_Core)){
			console.log(`Waiting [${i++}]`)
			await sleep(500);
		}
	}
	DrawSpacingHeader('Reverting the Core to Source');

	await renameFolders_2();
}

main();
