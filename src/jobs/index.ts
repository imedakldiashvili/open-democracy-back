
import { cronJobCreateElection  } from "./Elections/cronJobElection";



const cronJobsStart = () =>
{
    console.log("cron jobs starting ...")
    cronJobCreateElection.start();
    console.log("cron jobs started successfuly")
}


export { cronJobsStart }