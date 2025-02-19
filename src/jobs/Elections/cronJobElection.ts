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
        console.log(new Date().toISOString(), "createElection ...")
        var resut = await serviceCreateElection(1000)
        console.log(new Date().toISOString(), "createElection ", resut)
        return resut
    }
)

export const cronJobElectionProcessing = cron.schedule(
    "*/1 * * * *",
    async () => { 
        console.log(new Date().toISOString(), "processElection ...")
        var resut = await serviceProcessElection()
        console.log(new Date().toISOString(), "processElection", resut)
        return resut
    }
)