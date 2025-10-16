import * as sendgrid from "@sendgrid/mail";
import settings from "../../../settings";
import { MailMsg, SmsMsg } from "../interfaces";
import { sendSMS } from "../smsApi";
import * as nodemailer from "nodemailer";
sendgrid.setApiKey(settings.SENDGRID_API_KEY);


export const sendMail = async (mailMsg: MailMsg) => {
    // const message = "mail sent successfuly"
    // try {
    //     await sendgrid.send(mailMsg)
    //     return message;
    // } catch (error) {
    //     return error
    // }
    const result = await emailSender(mailMsg)
    return result
}


export const emailSender = async (mailMsg: MailMsg) => {
  const message = "mail sent successfuly"
  try {
    // 1️⃣ Transporter-ის შექმნა
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: settings.EMAIL_USER,
        pass: settings.EMAIL_PASS,
      },
    });

    // 2️⃣ ელ.ფოსტის პარამეტრები
    const mailOptions = {
      from: `"Open Democracy" <${mailMsg.from}>`,
      to: mailMsg.to,
      subject: mailMsg.subject,
      text: "mail",
      html: mailMsg.html,
    };
    // 3️⃣ გაგზავნა
    const info = await transporter.sendMail(mailOptions);
    return {message: "Email sent", respone: info.response};
  } catch (error) {
    console.log(error)
    return {message: "Error sending email", error: error.toString()};
  }
}


export const sendSms = async (smsMsg: SmsMsg) => {
    await sendSMS(smsMsg.from, smsMsg.smsText);
}

