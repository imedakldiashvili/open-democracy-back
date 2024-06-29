import axios from "axios";
import { stringify } from "querystring";
import { BankBOGTokenRepository } from "../repositories";
import { BankBOGToken } from "../entities/BankBOGToken";
import { newGuid } from "../../../utils";
import { addSecunds, dateNow } from "../../../utils/dates";
import { token } from "morgan";
import settings from "../../../settings";

export const getNewBOGToken = async () => {
  const url = "https://account.bog.ge/auth/realms/bog/protocol/openid-connect/token"

  const username = settings.BANKS.BOG_USER;
  const pwd = settings.BANKS.BOG_PASSWORD;
  const buffer = Buffer.from(username + ":" + pwd, "utf8");
  const base64 = buffer.toString("base64");

  const data = stringify({
    grant_type: "client_credentials",
    client_id: username,
    client_secret: pwd,
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Authorization': `Basic ${base64}`,
  }

  const result = await axios
    .post(url, data, { headers })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response ? error.response : error;
    });

  return { token: result.data.access_token, tokenType: result.data.token_type, expiresIn: result.data.expires_in };
}

export const getBOGTodaysActivities = async (account) => {
  const tokenData = await getBOGToken();
  const token = tokenData.token
  const response = await axios.get(
    "https://api.businessonline.ge/api/documents/todayactivities/" + account + "/GEL",
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const newArray = response.data.map((data: any) => {
    return {
      uid: data?.Id,
      date: data?.PostDate,
      clientCode: + data?.PayerInn,
      clientName: data?.PayerName,
      accountNumber: data?.Sender?.AccountNumber,      
      amount: data?.Amount,
      desctiption: data?.EntryComment,
    };
  });
  return newArray;
}

export const getBOGToken = async () => {
  var dateTimeNow = dateNow();
  var allTockens = await BankBOGTokenRepository.find()
  var activeTokens = allTockens.filter(e => e.expiredOn < dateTimeNow);
  var token = new BankBOGToken()
  if (activeTokens.length) {
    token = activeTokens[0]
  }
  else {
    await BankBOGTokenRepository.remove(allTockens)
    const result = await getNewBOGToken()
    token.id = newGuid()
    token.token = result.tokenType + " " + result.token
    token.tokenType = result.tokenType
    token.createdOn = dateTimeNow
    token.expireIn = result.expiresIn
    token.expiredOn = addSecunds(dateTimeNow, result.expiresIn)
    await BankBOGTokenRepository.save(token)
  }
  return token
};


