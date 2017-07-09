var server = require('./core/server');
var mp3Downloader = require('./core/mp3Downloader').newInstance();
var playlistDownloader = require('./core/playlistDownloader').newInstance();

//server.runServer(8080);
playlistDownloader.setOutputPath("/home/slawek/Desktop/mp3");
playlistDownloader.downloadPlaylist("https://www.youtube.com/playlist?list=PL_y9IBDHBX_Kb_3xU17C3Feve5XU-u2iX");
//mp3Downloader.setOutputPath("/home/slawek/Desktop");
//mp3Downloader.downloadMp3("https://www.youtube.com/watch?v=J5lDFroE4zY");