import axios from "axios";
import * as fs from 'fs-extra'
import * as https from "https";
import * as path from "path";
import * as fastxml from "fast-xml-parser";

import { accountMovementsConfig, accountMovementsXmlReqBody, changePassworConfig, changePasswordXmlReqBody } from "./soap";
import { servicebankSettings } from "../../services";
import { bankTokenRepository } from "../../repositories";
import { dateNow } from "../../../../utils";

import { throwBadRequest } from "../../../../middlewares/error";
import keys from "../../../../../keys";


const baseUrl = "https://secdbi.tbconline.ge/dbi/dbiService"

const getAxiosInstance = () => {

  const certPath = path.join(__dirname, '../../../../../keys/cert/'+keys.TBC_CERT_FILE_NAME+'.pfx');
  console.log(certPath);
  const httpsAgent = new https.Agent({
    pfx: fs.readFileSync(certPath),
    passphrase: keys.TBC_CERT_PASSWORD,
    host: "secdbi.tbconline.ge",
  });
  return axios.create({ httpsAgent });
};


export const tbcChangePassword = async ({ tbcUsername, tbcActualPassword, tbcDigipass, tbcNewPassword }) => {
  try {

    const instance = getAxiosInstance();
    const xmlReqBody = changePasswordXmlReqBody(tbcUsername, tbcActualPassword, tbcDigipass, tbcNewPassword)
    const config = changePassworConfig()
    const response = await instance.post(
      baseUrl,
      xmlReqBody,
      config
    );

  } catch (e) {
    console.log(e);
  }

}

export const tbcAccountMovements = async () => {
  try {
    const bankSettings = await servicebankSettings();
    const bankSettingTbcAccount = bankSettings.filter(e => e.code == "TBC_ACCOUNT")[0]
    const bankSettingTbcUserName = bankSettings.filter(e => e.code == "TBC_USER_NAME")[0]
    const bankSettingTbcMovementStart = bankSettings.filter(e => e.code == "TBS_MOVEMENT_DATE_START")[0]

    const tbcDigipass = 'notMandatory'
    const account = bankSettingTbcAccount.value
    const tbcUsername = bankSettingTbcUserName.value
    const statDate = bankSettingTbcMovementStart.value
    const tbcActualPassword = await tbcGetActualPassword()
    const pageSize = 700

    let pageIndex = 0
    let totalNumber = pageSize

    const result = {
      paging: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalNumber: totalNumber
      },
      transactions: []
    }

    const instance = getAxiosInstance();

    while (true) {
      const xmlReqBody = accountMovementsXmlReqBody(tbcUsername, tbcActualPassword, tbcDigipass, statDate, pageIndex.toString(), pageSize.toString())
      const config = accountMovementsConfig()
      const response = await instance.post(baseUrl, xmlReqBody, config);

      const options = {
        numberParseOptions: {
            "hex": false,
            leadingZeros: false
        }
      };


      const parser = new fastxml.XMLParser(options);
      const parserResultObj = parser.parse(response.data, true);

      const pageResult = parserResultObj["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns2:GetAccountMovementsResponseIo"]["ns2:result"]
      const resultTotalNumber = pageResult["ns2:totalCount"];
      totalNumber = resultTotalNumber

      const transactionsResult = parserResultObj["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns2:GetAccountMovementsResponseIo"]["ns2:accountMovement"]
      if (transactionsResult) {
        if (transactionsResult.length)
        {
          for (var t of transactionsResult) {
            const transaction = getTransaction(t, account)
            if (transaction) { result.transactions.push(transaction) } 
          }
        }
        else
        {
          const transaction = getTransaction(transactionsResult, account)
          if (transaction) { result.transactions.push(transaction) }          
        }
      }

      if (totalNumber < pageIndex * pageSize) { break }
      pageIndex++

    }
    result.paging.totalNumber = totalNumber

    return result
  } catch (e) {
    console.log(e);
  }

}

export const tbcGetActualPassword = async () => {
  const bank = "TB"
  const dateTimeNow = dateNow();
  const allTockens = await bankTokenRepository.find()
  const tbcTokens = allTockens.filter(e => e.bank == bank);
  const activeTokens = tbcTokens.filter(e => dateTimeNow < e.expiredOn);
  if (activeTokens.length != 1) { throwBadRequest("tbc_actual_password_not_found") }
  const tbcToken = activeTokens[0]
  const actualPassword = tbcToken.token
  return actualPassword
};

const getTransaction = (xmlTransaction, account) => {
          const t = xmlTransaction
          const debitCredit = t["ns2:debitCredit"]
          if (!debitCredit) { return null }

          const accountNumber = t["ns2:accountNumber"].toString()
          if (account != accountNumber) { return null }

          const partnerAccountNumber = t["ns2:partnerAccountNumber"].toString()
          const currency = t["ns2:amount"]["ns2:currency"]
          const externalPaymentId = t["ns2:externalPaymentId"].toString()
          const valueDate = t["ns2:valueDate"]
          const partnerTaxCode = t["ns2:partnerTaxCode"].toString()
          const partnerName = t["ns2:partnerName"].toString()
          const description = t["ns2:description"].toString()
          const amount = t["ns2:amount"]["ns2:amount"]

          const transaction = {
            uid: externalPaymentId,
            date: valueDate,
            clientCode: partnerTaxCode.toString(),
            clientName: partnerName.toString(),
            accountNumber: partnerAccountNumber.toString(),
            amount: amount,
            currency: currency,
            description: description.toString(),
          }
          return transaction

}