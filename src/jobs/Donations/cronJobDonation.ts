import * as cron from "node-cron";
import { serviceBOGTransactionProcesing, serviceTBCTransactionProcesing } from "../../modules/banks/services";


export const cronJobBankTrasactions = cron.schedule(
    "*/5 * * * *",
    async () => { 
        console.log(new Date().toISOString(),"BOGTransaction ...")
        var resut = await serviceBOGTransactionProcesing()
        console.log(new Date().toISOString(),"BOGTransaction ", resut)

        console.log(new Date().toISOString(), "TBCTransaction ...")
        var resut = await serviceTBCTransactionProcesing()
        console.log(new Date().toISOString(),"TBCTransaction ", resut)
        
        return resut
    }
)

