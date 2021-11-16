import yargs from 'yargs';
import {addScrapCommand} from './cmd/scrap';

const { hideBin } = require('yargs/helpers')


let addCommands = (yargsObj: yargs.Argv<{}>, commands: ((yargs: yargs.Argv<{}>)=> yargs.Argv<{}>)[]): yargs.Argv<{}> => commands.length === 0 ? yargsObj : addCommands(commands[0](yargsObj), commands.slice(1))

addCommands(yargs(hideBin(process.argv)), [
  addScrapCommand
])
  .help()
  .argv
