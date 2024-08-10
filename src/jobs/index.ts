
import { cronJobBankTrasactions } from "./Donations/cronJobDonation";
import { cronJobCreateElection  } from "./Elections/cronJobElection";



const cronJobsStart = () =>
{
    console.log(new Date().toISOString(), "cron jobs elections starting ...")
    cronJobCreateElection.start();
    console.log(new Date().toISOString(), "cron jobs elections started successfuly")
    
    console.log(new Date().toISOString(), "cron jobs BankTransction starting ...")
    cronJobBankTrasactions.start();
    console.log(new Date().toISOString(), "cron jobs BankTransction started successfuly")
    
}


export { cronJobsStart }