import * as child_process from "child_process";
import * as path from "path";
import { logger } from "./Logging";

export class MitmProxyRunner{
    private mitmDumpProcess?: child_process.ChildProcessWithoutNullStreams;

    start(argv: any){
        const savePath = path.join(".", "save.mitm");
        this.mitmDumpProcess = child_process.spawn("mitmdump", ["--set", "upstream-cert=false", "--set", "server_replay_kill_extra=true", "--set", "server_replay_nopop=true", "--set" ,"save_stream_file="+"save.mitm"], {detached: true});
        logger.info(`Mitmdump process is saving traffic to ${savePath}`);
        argv['proxyAddr'] = "http://localhost:8080";
    }

    stop(): boolean{
        if(!this.mitmDumpProcess!.killed){
            //TODO logger file close
            return this.mitmDumpProcess!.kill('SIGINT');
        } else{
            return true;
        }
    }
}