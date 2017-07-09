var express = require('express');
var app = express();

module.exports = {runServer: runServer};

app.get('/', function(request, response) {
    response.sendFile('/home/slawek/youtubeDownloader/core/example.html');
});

app.use(function(request, response){
    response.setHeader('Content-Type', 'text/plain');
    response.status(404).send('Page cannot be found!');
});

function runServer(port) {
    app.listen(port);
}

