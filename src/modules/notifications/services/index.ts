import * as sendgrid from "@sendgrid/mail";
import settings from "../../../settings";
import { MailMsg, SmsMsg } from "../interfaces";
import { sendSMS } from "../smsApi";
sendgrid.setApiKey(settings.SENDGRID_API_KEY);


export const sendMail = async (mailMsg: MailMsg) => {
    const message = "mail sent successfuly"
    try {
        await sendgrid.send(mailMsg)
        return message;
    } catch (error) {
        return error
    }
}


export const sendSms = async (smsMsg: SmsMsg) => {
    await sendSMS(smsMsg.from, smsMsg.smsText);
}