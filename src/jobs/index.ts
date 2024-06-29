
import { cronJobBankTrasactions } from "./Donations/cronJobDonation";
import { cronJobCreateElection  } from "./Elections/cronJobElection";



const cronJobsStart = () =>
{
    console.log("cron jobs elections starting ...")
    cronJobCreateElection.start();
    console.log("cron jobs elections started successfuly")
    
    console.log("cron jobs BankTransction starting ...")
    cronJobBankTrasactions.start();
    console.log("cron jobs BankTransction started successfuly")
    
}


export { cronJobsStart }