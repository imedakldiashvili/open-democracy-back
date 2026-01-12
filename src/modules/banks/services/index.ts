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
            const resultDescriptionIvivitationId = getTrasactionDescriptionInfo(transaction.description)
            const clientCode =  transaction.clientCode;
            const clientName =  getClientName(transaction.clientName, transaction.clientCode);            
            await addUserPersonalId(clientCode, clientName, transaction.uid, 1, 'bank', resultDescriptionIvivitationId)
            
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
            const resultDescriptionIvivitationId = getTrasactionDescriptionInfo(transaction.description)
            if (resultDescriptionIvivitationId)
            {
                const clientCode =  transaction.clientCode;
                const clientName =  getClientName(transaction.clientName, transaction.clientCode);
                await addUserPersonalId(clientCode , clientName, transaction.uid, 1, 'bank', resultDescriptionIvivitationId)    
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    return { status: 1, message: "TBC Transaction processed successfuly" };
}

const getTrasactionDescriptionInfo = (transactionDescription: string) =>
{
    var result = null
    const matches = transactionDescription.match(/\d+/g);
    if (matches)
    {
        if ((matches.length == 1)) { 
            if (matches[0].length == 9)
            {
                result = matches[0] 
            }
        }
    }
    return result;
}

const getClientName = (clientName: string, clientCode: string) =>
{
    var result = clientName = clientName.replace(", " + clientCode, "");
    result = result.replace(clientCode, "");
    result = result.replace("ი/მ ", "");
    return result;
}

export const serviceBankAccounts = async () => {

    const bankSettings = await bankSettingRepository.find({where: {code: Like('%ACCOUNT')}});
    return bankSettings;
}

export const servicebankSettings = async () => {

    const bankSettings = await bankSettingRepository.find();
    return bankSettings;
}