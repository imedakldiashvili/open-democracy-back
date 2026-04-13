import {
    serviceBOGTransactionProcesing,
    serviceTBCTransactionProcesing,
} from "../../modules/banks/services"

export const jobServiceBOGTransactionProcesing = async () => {
    try {
        return await serviceBOGTransactionProcesing()
    } catch (error) {
        console.log("[jobServiceBOGTransactionProcesing] error", error)
        return { status: 0, message: "job_bog_transaction_processing_failed" }
    }
}

export const jobServiceTBCTransactionProcesing = async () => {
    try {
        return await serviceTBCTransactionProcesing()
    } catch (error) {
        console.log("[jobServiceTBCTransactionProcesing] error", error)
        return { status: 0, message: "job_tbc_transaction_processing_failed" }
    }
}
