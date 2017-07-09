var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var url = require("url");
var logger = require('./logger');

module.exports = {newInstance: Mp3Downloader};

function Mp3Downloader() {
    var outputPath;

    return {
        setOutputPath: setOutputPath,
        downloadMp3: downloadMp3
    };

    function setOutputPath(path) {
        outputPath = path;
    }

    function downloadMp3(videoUrl) {
        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": "/usr/bin/ffmpeg",
            "outputPath": outputPath,
            "youtubeVideoQuality": "highest",
            "queueParallelism": 20,
            "progressTimeout": 2000
        });

        YD.on("finished", function (err, data) {
            logger.info(JSON.stringify(data));
        });

        YD.on("error", function (error) {
            logger.error(error);
        });

        YD.on("progress", function (data) {
            logger.info(data.progress.percentage + "%");
        });
        var videoId = youtubeURLToVideoId(videoUrl);
        YD.download(videoId);
    }

    function youtubeURLToVideoId(urlString) {
        var query = url.parse(urlString, true).query;
        var videoId = query.v;
        return videoId;
    }
}
