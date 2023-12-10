import * as cron from "node-cron";
import { serviceCalculateElectionResult, serviceCloseElection, servicePublishElection, serviceStartElection, serviceUpdateElectionTimePeriod } from "../../modules/elections/services";


export const cronJobElection = cron.schedule(
    "*/1 * * * *",
    async () => { 
        console.log("publishElection ...")
        var resutPublish = await servicePublishElection()
        console.log("publishElection", resutPublish)

        console.log("startElection ...")
        var resutStart = await serviceStartElection() 
        console.log("startElection", resutStart)

        console.log("updateElection ...")
        var resutUpdate = await serviceUpdateElectionTimePeriod() 
        console.log("updateElection", resutUpdate)


        console.log("closeElection ...")
        var resutClose = await serviceCloseElection() 
        console.log("closeElection", resutClose)

        console.log("resultlection ...")
        var resutCalculate = await serviceCalculateElectionResult()
        console.log("resultlection", resutCalculate)
    }
)

