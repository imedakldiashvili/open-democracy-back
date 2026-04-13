import * as cron from "node-cron"
import {
    jobServiceBOGTransactionProcesing,
    jobServiceTBCTransactionProcesing,
} from "./jobServiceDonation"

export const cronJobBankTrasactions = cron.schedule(
    "*/5 * * * *",
    async () => {
        console.log(new Date().toISOString(), "BOGTransaction ...")
        const bogResult = await jobServiceBOGTransactionProcesing()
        console.log(new Date().toISOString(), "BOGTransaction ", bogResult)

        console.log(new Date().toISOString(), "TBCTransaction ...")
        const tbcResult = await jobServiceTBCTransactionProcesing()
        console.log(new Date().toISOString(), "TBCTransaction ", tbcResult)

        return { bog: bogResult, tbc: tbcResult }
    }
)
