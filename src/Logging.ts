import winston from 'winston';
import * as path from 'path';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
});

function configureLogger() {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(), level: 'debug',
  }));
  logger.add(new winston.transports.File({
    filename: 'debug.log', level: 'debug',
  }))
}

function configureCwdInfoLogger(){
  logger.add(new winston.transports.File({
    filename: path.join(process.cwd(), 'info.log'), level: 'info',
  }))
}

function __configureTestLogger(){
  logger.add(new winston.transports.Console({
    format: winston.format.simple(), level: 'debug',
  }));
}

function stopLogger() {
  logger.end()
  logger.close();
}

export { logger, configureLogger, __configureTestLogger, stopLogger, configureCwdInfoLogger };
