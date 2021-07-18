const http = require('http');
const Screenshot = require('url-to-screenshot');
const fs = require('fs');
const open = require('open');
var input_url = require('./input.json');
var output = {};
var key = 'file';


const requestListener = function (req, res) {
  res.writeHead(200);
  const s = new Screenshot(input_url.url)
    .capture()
    .then(img => {
      fs.writeFileSync(__dirname + '/img.png', img);
      output[key] = __dirname + '/img.png';
      var json = JSON.stringify(output);
      fs.writeFile('output.json', json, 'utf8', function (err) {
        if (err) throw err;
      });
      console.log('complete');
    })
  res.end(input_url.url);
}

const server = http.createServer(requestListener);
server.listen(8080);
open('http://localhost:8080');
