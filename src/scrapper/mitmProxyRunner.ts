import * as child_process from "child_process";
import * as path from "path";
import * as fs from "fs";
import { logger } from "../Logging";
import { nextTick } from "process";
import { sleep } from "../utils";

export class MitmProxyRunner{
    private mitmDumpProcess?: child_process.ChildProcessWithoutNullStreams;

    async start(argv: any): Promise<void>{
        const savePath = path.join(".", "save.mitm");
        this.mitmDumpProcess = child_process.spawn("mitmdump", ["--set", "upstream_cert=false", "--set", "server_replay_kill_extra=true", "--set", "server_replay_nopop=true", "--set" ,"save_stream_file="+"save.mitm"], {detached: true});
        await sleep(5000);
        logger.info(`Mitmdump process is saving traffic to ${savePath}`);
        argv['proxyAddr'] = "http://localhost:8080";
    }

    async stop(removeResult: boolean): Promise<boolean>{
        let killed = this.mitmDumpProcess!.killed
        if(!killed){
            let stopped = false;
            //TODO logger file close
            this.mitmDumpProcess!.addListener('exit', (code, sig) => {
                stopped = true;
                if(code != 0){
                    console.log('Mitmdump exited with non-zero code');
                }
            });
            killed = this.mitmDumpProcess!.kill('SIGINT');
            await sleep(2000);
            if(!stopped){
                throw new Error('Mitmproxy process is not stopped');
            }
        }
        if(removeResult && fs.existsSync("save.mitm")){
            console.log('Removing file saved by mitmproxy');
            fs.unlinkSync("save.mitm");
        }

        return killed;
    }
}