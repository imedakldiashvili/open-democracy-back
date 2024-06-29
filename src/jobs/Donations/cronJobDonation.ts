import * as cron from "node-cron";
import { serviceBOGTransactionProcesing } from "../../modules/banks/services";


export const cronJobBankTrasactions = cron.schedule(
    "*/5 * * * *",
    async () => { 
        console.log("BOGTransaction ...")
        var resut = await serviceBOGTransactionProcesing()
        console.log("BOGTransaction ", resut)
        
        return resut
    }
)

