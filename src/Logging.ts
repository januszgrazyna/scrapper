import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
});

function configureScrapperLogger(scrapperType: string, debug: boolean) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(), level: 'debug',
  }));
  logger.add(new winston.transports.File({
    filename: 'info.log', level: 'info',
  }))
}

function __configureTestLogger(){
  logger.add(new winston.transports.Console({
    format: winston.format.simple(), level: 'debug',
  }));
}

function stopLogger() {
  logger.end()
}

export { logger, configureScrapperLogger, __configureTestLogger, stopLogger };
