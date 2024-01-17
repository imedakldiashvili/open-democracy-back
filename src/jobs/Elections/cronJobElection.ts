import * as cron from "node-cron";
import 
{ 
    serviceCreateElection,
    serviceProcessElection, 
} 
    from "../../modules/elections/services";

export const cronJobCreateElection = cron.schedule(
    "0 0 1 * *",
    async () => { 
        console.log("createElection ...")
        var resut = await serviceCreateElection()
        console.log("createElection ", resut)
        return resut
    }
)

export const cronJobElectionProcessing = cron.schedule(
    "*/1 * * * *",
    async () => { 
        console.log("processElection ...")
        var resut = await serviceProcessElection()
        console.log("processElection", resut)
        return resut
    }
)