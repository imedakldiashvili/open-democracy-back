import axios from "axios";
import { stringify } from "querystring";

export const getBOGToken = async () => {
    // const url = "https://account.bog.ge/auth/realms/bog/protocol/openid-connect/token"

    
    // const parameters = stringify({
    //     grant_type: "client_credentials",
    //     client_id: clientId,
    //     client_secret: clientSecret,
    //     scope: "read write",
    //   })
      
    // const buffer = Buffer.from(clientId + ":" + clientSecret, "utf8")
    // const base64 = buffer.toString("base64")

    // const headers = {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "Authorization": `Basic ${base64}`,
    //   }

    // const result = await axios
    //   .post(url, { headers, parameters })
    //   .then(function (response) {
    //     return response;
    //   })
    //   .catch(function (error) {
    //     return error.response ? error.response : error;
    //   });
  
    return "result";
  }
  

  
