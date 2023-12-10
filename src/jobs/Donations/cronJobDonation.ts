import * as cron from "node-cron";


export const cronJobDonation = cron.schedule(
    "*/5 * * * *",
    async () => { }
)