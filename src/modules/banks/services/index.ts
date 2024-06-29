import settings from "../../../settings";
import { dateNow, dateNowAddMinutes } from "../../../utils";
import { BankTransaction } from "../../donations/entities";
import { BankTransactionRepository } from "../../donations/repositories";
import { UserInivitation } from "../../users/entities";
import { userInivitationRepository } from "../../users/repositories";
import { addUserInivitation } from "../../users/services";
import { getBOGTodaysActivities } from "../api";


export const serviceBOGTransactionProcesing = async () => {

    const account = settings.BANKS.BOG_ACCOUNT
    const transactions = await getBOGTodaysActivities(account)

    const addBankTransaction = async (transaction) => {
        var newBankTransaction = new BankTransaction()
        const channelCode = 'BG'
        var exBankTransactions = await BankTransactionRepository.find({ where: { channelCode: channelCode, transactionUid: transaction.uid } })

        if (exBankTransactions.length) { return }

        newBankTransaction.channelCode = channelCode
        newBankTransaction.transactionUid = transaction.uid
        newBankTransaction.transactionClientCode = transaction.clientCode
        newBankTransaction.transactionClientName = transaction.clientName
        newBankTransaction.transactionAccount = transaction.accountNumber
        newBankTransaction.transactionAccountMask = transaction.accountNumber.substring(0, 6) + '***' + transaction.accountNumber.substring(21, 2)
        newBankTransaction.transactionAmount = transaction.amount
        newBankTransaction.transactionDescription = transaction.desctiption
        newBankTransaction.transactionDate = transaction.date
        newBankTransaction.createdBy = 1
        newBankTransaction.createdOn = dateNow()
        await BankTransactionRepository.save(newBankTransaction)
    }

    for (var transaction of transactions) {
        try {
            await addBankTransaction(transaction)
        } catch (error) {
            console.log(error)
        }

        try {
            await addUserInivitation(transaction.clientCode, transaction.clientName, transaction.uid, 1, 'bank')
        } catch (error) {
            console.log(error)
        }
    }

    return { status: 1, message: "BOG Transaction processed successfuly" };
}