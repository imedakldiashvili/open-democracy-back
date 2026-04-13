import * as cron from "node-cron"
import { jobServiceCreateElection, jobServiceProcessElection } from "./jobServiceElection"

export const cronJobCreateElection = cron.schedule(
    "0 0 1 * *",
    async () => {
        console.log(new Date().toISOString(), "createElection ...")
        const result = await jobServiceCreateElection(1000)
        console.log(new Date().toISOString(), "createElection ", result)
        return result
    }
)

export const cronJobElectionProcessing = cron.schedule(
    "*/1 * * * *",
    async () => {
        console.log(new Date().toISOString(), "processElection ...")
        const result = await jobServiceProcessElection()
        console.log(new Date().toISOString(), "processElection", result)
        return result
    }
)
