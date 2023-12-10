
import { cronJobElection } from "./Elections/cronJobElection";



const cronJobsStart = () =>
{
    console.log("cron jobs starting ...")
    cronJobElection.start();
    console.log("cron jobs started successfuly")
}


export { cronJobsStart }