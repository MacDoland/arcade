const fs = require('fs');
const Path = require('path');

function readDirR(dir) {
    return fs.statSync(dir).isDirectory()
        ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(Path.join(dir,f)))).filter(item => item.indexOf('config.json') > -1)
        : dir;
}

var files = readDirR('./games')
var config = {
    games: []
};

for(var i = 0; i < files.length; i++){
    try{
        var contents = fs.readFileSync(files[i], 'utf8');
        config["games"].push(JSON.parse(contents));
    }
    catch(e){
        console.log(e);
    }
}

fs.writeFile("./data/config.json", JSON.stringify(config), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The config was built successfully.");
}); 


