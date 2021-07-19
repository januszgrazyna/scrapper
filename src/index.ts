import { exit } from 'process';
import yargs from 'yargs';
import * as scrapper from './scrapper';


const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
  .command('scrap', 'start scrapper', (yargs) => {
    yargs
      .option('type', {
        describe: 'scrapper type',
        default: 'Default',
      })
      .option('debug', {
        describe: 'debug',
        default: false,
      })
      .help()
  }, async (argv) => {
    const debug = argv.debug as boolean
    if(debug){
      process.env['DEBUG'] = "true"
    }
    const result = await scrapper.start({
      type: argv.type as string,
      debug: debug
    }, argv);
    if(result.error){
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