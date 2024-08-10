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


const baseUrl = "https://secdbi.tbconline.ge/dbi/dbiService"

const getAxiosInstance = () => {
  const httpsAgent = new https.Agent({
    pfx: fs.readFileSync(
      path.join(__dirname, "..", "..", "..", "/banks/api/tbc/cert/DIGITAL PARTNER LTD.pfx")
    ),
    passphrase: "1RaYf--5",
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


    console.log(response);
  } catch (e) {
    console.log(e);
  }

}

export const tbcAccountMovements = async () => {
  try {
    const bankSettings = await servicebankSettings();
    const bankSettingTbcAccount = bankSettings.filter(e => e.code == "TBC_ACCOUNT")[0]
    const bankSettingTbcUserName = bankSettings.filter(e => e.code == "TBC_USER_NAME")[0]

    const tbcDigipass = 'notMandatory'
    const account = bankSettingTbcAccount.value
    const tbcUsername = bankSettingTbcUserName.value
    const tbcActualPassword = await tbcGetActualPassword()
    const statDate = '2015-01-01T00:00:00.000'
    const pageIndex = 0
    const pageSize = 700

    const instance = getAxiosInstance();
    const xmlReqBody = accountMovementsXmlReqBody(tbcUsername, tbcActualPassword, tbcDigipass, statDate, pageIndex.toString(), pageSize.toString())
    const config = accountMovementsConfig()
    const response = await instance
      .post(
        baseUrl,
        xmlReqBody,
        config);

    const parser = new fastxml.XMLParser();
    const parserResultObj = parser.parse(response.data, true);

    const pageResult = parserResultObj["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns2:GetAccountMovementsResponseIo"]["ns2:result"]
    const resultPageIndex = pageResult["ns2:pager"]["ns2:pageIndex"];
    const resultPageSize = pageResult["ns2:pager"]["ns2:pageSize"];
    const resultTotalNumber = pageResult["ns2:totalCount"];

    const transactionsResult = parserResultObj["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns2:GetAccountMovementsResponseIo"]["ns2:accountMovement"]

    const result = {
      paging: {
        pageIndex: resultPageIndex,
        pageSize: resultPageSize,
        totalNumber: resultTotalNumber
      },
      transactions: []
    }

    for (var t of transactionsResult) {
      const debitCredit = t["ns2:debitCredit"]
      if (!debitCredit) { continue }

      const accountNumber = t["ns2:accountNumber"]
      if (account != accountNumber) { continue }

      
      const partnerAccountNumber = t["ns2:partnerAccountNumber"]
      const currency = t["ns2:amount"]["ns2:currency"]
      const externalPaymentId = t["ns2:externalPaymentId"]
      const valueDate = t["ns2:valueDate"]
      const partnerTaxCode = t["ns2:partnerTaxCode"]
      const partnerName = t["ns2:partnerName"]
      const description = t["ns2:description"]
      const amount = t["ns2:amount"]["ns2:amount"]

      const transaction = {
        uid: externalPaymentId,
        date: valueDate,
        clientCode: partnerTaxCode,
        clientName: partnerName,
        accountNumber: partnerAccountNumber,
        amount: amount,
        currency: currency,
        desctiption: description,
      }

      result.transactions.push(transaction)
    }

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
  const activeTokens = tbcTokens.filter(e => dateTimeNow < e.expiredOn  );
  if (activeTokens.length != 1) { throwBadRequest("tbc_actual_password_not_found") }
  const tbcToken = activeTokens[0]
  const actualPassword = tbcToken.token
  return actualPassword
};