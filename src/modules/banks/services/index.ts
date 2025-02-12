import { Like } from "typeorm";
import settings from "../../../settings";
import { dateNow} from "../../../utils";
import { BankTransaction } from "../../donations/entities";
import { BankTransactionRepository } from "../../donations/repositories";
import { addUserPersonalId } from "../../users/services";
import { getBOGTodaysActivities, tbcAccountMovements } from "../api";
import { bankSettingRepository } from "../repositories";



const addBankTransaction = async (transaction) => {
    var newBankTransaction = new BankTransaction()
    const channelCode = transaction.accountNumber.substring(4).substring(0, 2)
    var exBankTransactions = await BankTransactionRepository.find({ where: { channelCode: channelCode, transactionUid: transaction.uid } })

    if (exBankTransactions.length) { return }


    console.log(transaction)

    newBankTransaction.channelCode = channelCode
    newBankTransaction.transactionUid = transaction.uid
    newBankTransaction.transactionClientCode = transaction.clientCode
    newBankTransaction.transactionClientName = transaction.clientName
    newBankTransaction.transactionAccount = transaction.accountNumber
    newBankTransaction.transactionAccountMask = transaction.accountNumber.substring(0, 6) + '***' + transaction.accountNumber.substring(20).substring(0, 2) 
    newBankTransaction.transactionAmount = transaction.amount
    newBankTransaction.transactionDescription = transaction.description
    newBankTransaction.transactionDate = transaction.date
    newBankTransaction.createdBy = 1
    newBankTransaction.createdOn = dateNow()
    await BankTransactionRepository.save(newBankTransaction)
}


export const serviceBOGTransactionProcesing = async () => {

    var bankSettings = await servicebankSettings();
    const bankSetting = bankSettings.filter(e=> e.code == "BOG_ACCOUNT")[0]
    const account = bankSetting.value;
    const transactions = await getBOGTodaysActivities(account)

    for (var transaction of transactions) {
        try {
            await addBankTransaction(transaction)
        } catch (error) {
            console.log(error)
        }

        try {
            const mobileNumber = transaction.description.match(/\d+/g);
            await addUserPersonalId(transaction.clientCode, transaction.clientName, transaction.uid, 1, 'bank', mobileNumber)
        } catch (error) {
            console.log(error)
        }
    }

    return { status: 1, message: "BOG Transaction processed successfuly" };
}

export const serviceTBCTransactionProcesing = async () => {

    var bankSettings = await servicebankSettings();
    const account = bankSettings.filter(e=> e.code == "TBC_ACCOUNT")[0]
    const result = await tbcAccountMovements()

    for (var transaction of result.transactions) {
        try {
            await addBankTransaction(transaction)
        } catch (error) {
            console.log(error)
        }

        try {
            const mobileNumber = transaction.description.match(/\d+/g);
            await addUserPersonalId(transaction.clientCode, transaction.clientName, transaction.uid, 1, 'bank', mobileNumber)
        } catch (error) {
            console.log(error)
        }
    }

    return { status: 1, message: "TBC Transaction processed successfuly" };
}


export const serviceBankAccounts = async () => {

    const bankSettings = await bankSettingRepository.find({where: {code: Like('%ACCOUNT')}});
    return bankSettings;
}

export const servicebankSettings = async () => {

    const bankSettings = await bankSettingRepository.find();
    return bankSettings;
}