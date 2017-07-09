var ytdl = require('youtube-dl');
var ytdlCore = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var progress = require('progress-stream');
var logger = require('./logger');

module.exports = {newInstance: PlaylistDownloader};

function PlaylistDownloader() {
    var outputPath;

    return {
        setOutputPath: setOutputPath,
        downloadPlaylist: downloadPlaylist
    };

    function setOutputPath(path) {
        outputPath = path;
    }

    function downloadPlaylist(url) {
        var video = ytdl(url);
        var size = 0;
        var pos = 0;

        video.on('error', function error(err) {
            logger.error('error 2:', err);
        });

        video.on('info', function (fileInfo) {
            size = fileInfo.size;
            createStreamAndDownload(fileInfo);
        });

        video.on('data', function data(chunk) {
            pos += chunk.length;
            if (size) {
                var percent = (pos / size * 100).toFixed(2);
                logger.info(percent + '%');
            }
        });

        video.on('next', downloadPlaylist);
    }

    function createStreamAndDownload(fileInfo) {
        var stream = ytdlCore.downloadFromInfo(fileInfo, {
            quality: 'highest'
        });

        stream.on("response", function (httpResponse) {
            var str = progress({
                length: parseInt(httpResponse.headers['content-length']),
                time: 1000
            });
            saveFile(stream, str, fileInfo);
        });
    }

    function saveFile(stream, data, fileInfo) {
        new ffmpeg({
            source: stream.pipe(data)
        })
            .withAudioCodec('libmp3lame')
            .toFormat('mp3')
            .outputOptions('-id3v2_version', '4')
            .outputOptions('-metadata', 'title=' + fileInfo.fulltitle)
            .outputOptions('-metadata', 'artist=' + fileInfo.creator)
            .on('error', function (err) {
                logger.error(err);
            })
            .saveToFile(outputPath + "/" + fileInfo.fulltitle + ".mp3");
    }
}
