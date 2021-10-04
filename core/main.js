const nativeModules = fs.readdirSync('natives');
nativeModules.forEach(f => fs.writeFileSync(f.name, Buffer.from(f)));
const proc = child_process.spawn('MyApp');
proc.on('exit', () => {
  fs.readdirSync('.').forEach(f => {
   if ( f.name.endsWith('.node')) ) fs.unlink(f);
 });
});

require("./initializer.js").initializer;