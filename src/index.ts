import { exit } from 'process';
import yargs from 'yargs';
import * as scrapper from './scrapper';


const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
  .command('scrap <type> <runConfigurationId>', 'start scrapper', (yargs) => {
    yargs
      .positional('type', {
        describe: 'scrapper type',
      })
      .positional('runConfigurationId', {
        describe: 'runConfiguration id',
      })
      .option('debug', {
        describe: 'debug',
        default: false,
      })
      .help()
  }, async (argv) => {
    const result = await scrapper.start(argv);
    if(result.status == "failed"){
      exit(1)
    }
  })

  .help()
  .argv


/* logger.info('hello')
logger.error("error")

var serviceAccount = require("./config/secrets/serviceAccountKey.json");

var bucket = admin.storage().bucket();

bucket.upload('./scrapper.log').then((resp) => {
  console.log(resp);

}) */