import axios from "axios";
import keys from "../../../../keys";



export const sendSMS = async (phoneNumber: string, smsMessage: string)  => {
    try {
      const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

      const smsKey = keys.SMS_OFFICE_KEY;
      const smsSender = keys.SMS_SEMDER;

      const url = `http://smsoffice.ge/api/v2/send/?key=${smsKey}&destination=${phoneNumber}&sender=${smsSender}&content=${smsMessage}&urgent=true`;
      console.log(url)
      const response = await axios.get(encodeURI(url));
  
      console.log(response.data);
      return [random, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  };