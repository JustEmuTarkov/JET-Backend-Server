const fs = require('fs');
const UPX = require('./upx')('better');
const childProcess = require('child_process');

const ext_EXE = ".exe";
const DIR_EXE_NotCompressed = "./justemutarkov-win";
const DIR_EXE_NotCompressed_ICON = "./build/Server_Compiled_Icon";
const DIR_ICON = './dev/res/icon.ico';
const DIR_EXE_OUTPUT = "./_Build/justemutarkov-win";

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
  console.log("!Icon Changed!");
  UPX(DIR_EXE_NotCompressed_ICON + ext_EXE)
  .output(DIR_EXE_OUTPUT + ext_EXE)
  .start().then(function(stats) {
    console.log("!Compressed!");	
  }).finally(() => {
    resolve();
  }).catch(function (err) {
    console.log(err);
    reject();
  });
});