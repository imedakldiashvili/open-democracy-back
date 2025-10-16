import { NextFunction, Request, Response } from 'express'
import { sendMail, sendSms, emailSender } from '../services'




class SendNotification {
    static sendMail = async (req: Request, res: Response, next: NextFunction) => {
        const smsMsg  = req.body;
        var result = await sendMail(smsMsg);
        return res.json(result);
    }

    static sendSms = async (req: Request, res: Response, next: NextFunction) => {
        const smsMsg  = req.body;
        var result = await sendSms(smsMsg);

        return res.json(result);
    }
}

export default SendNotification;