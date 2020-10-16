var compressor = require('node-minify');
var fs = require('fs');


let files = fs.readdirSync('./core');//gert files to compress

for(let file of files){
	if(file.includes(".js")){
		compress(file);
	} else {
		let files_deep = fs.readdirSync('./core/' + file);
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
	console.log("compressing: ./core" + path_ + "/" + file);
	compressor.minify({
	  compressor: 'gcc',
	  input: "./core" + path_ + "/" + file,
	  output: "./coreMinify" + path_ + "/" + file,
	  callback: function(err, min) {}
	});
}

/*
compressor.minify({
  compressor: 'gcc',
  input: 'foo.js',
  output: 'bar.js',
  callback: function(err, min) {}
});

compressor.minify({
  compressor: 'uglifyjs',
  input: 'foo.js',
  output: 'bar.js',
  callback: function(err, min) {}
});
*/