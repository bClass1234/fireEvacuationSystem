var winston = require('winston');
var winstonDaily = require('winston-daily-rotate-file');


// 로그 설정
var logger = winston.createLogger({
    transports: [
        new (winstonDaily)({
                name: 'info-file',
                filename: './logs/app_%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                colorize: false,
                maxsize: 50000000,
                maxFiles: 1000,
                level: 'info',
                showLevel: true,
                json: false
            }),
        new (winston.transports.Console)({
                name: 'debug-console',
                colorize: true,
                level: 'info',
                showLevel: true,
                json: false
        })
    ]
    ,exceptionHandlers: [
        new (winstonDaily)({
                name: 'exception-file',
                filename: './logs/exception_%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                colorize: false,
                maxsize: 50000000,
                maxFiles: 1000,
                level: 'error',
                showLevel: true,
                json: false
        }),
        new (winston.transports.Console)({
                name: 'exception-console',
                colorize: true,
                level: 'debug',
                showLevel: true,
                json: false
        })
    ]
});

module.exports = logger;
