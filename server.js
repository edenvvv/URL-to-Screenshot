const http = require('http');
const Screenshot = require('url-to-screenshot');
const fs = require('fs');
const open = require('open');
var input_url = require('./input.json');
var output = {};
var key = 'file';

var videoshow = require('videoshow')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

/* create a 10 second videoshow of the screenshot */
var images = [
  'video.png'
]

var videoOptions = {
  fps: 25,
  transition: true,
  transitionDuration: 10, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  format: 'mp4',
  pixelFormat: 'yuv420p'
}


const requestListener = function (req, res) {
  res.writeHead(200);
  const s = new Screenshot(input_url.url)
    .capture()
    .then(img => {
      fs.writeFileSync(__dirname + '/video.png', img); // saves the original screenshot
      fs.writeFileSync(__dirname + '/video.mp4', img); // save as mp4
      output[key] = __dirname + '/video.mp4';
      var json = JSON.stringify(output);  // export as a json
      fs.writeFile('output.json', json, 'utf8', function (err) {
        if (err) throw err;
      });
      console.log('complete');
    })
  res.end(input_url.url);
}

const server = http.createServer(requestListener);
server.listen(8080);
open('http://localhost:8080'); // open the localhost (to convenience)
