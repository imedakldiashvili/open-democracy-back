import { NextFunction, Request, Response } from 'express'

import { addOTP, checkOTP, setLocation, verification } from '../services';
import { sendSMS } from '../../notifications/smsApi';



class UserVerificationController {


    static verificationOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const mobileNumber = req.body.mobileNumber

            let userSession = req.body.userSession            
            const userId = userSession.user.id
            const deviceUid = userSession.deviceUid
            
            const target = 'verification'
            
            const result = await addOTP(target, deviceUid, "mobile", mobileNumber,  userId)

            const smsText = `code: ${result.code} for ${target}`
            await sendSMS(mobileNumber, smsText)
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };



    static verification = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {personalId, firstName, lastName, mobileNumber, approvalCode} = req.body;
            const userId = req.body.userSession.user.id
            const deviceUid = req.body.userSession.deviceUid

            const resultOtp = await checkOTP("verification", deviceUid, "mobile", mobileNumber, userId, approvalCode)

            const result = await verification(deviceUid
                                            , personalId
                                            , firstName
                                            , lastName
                                            , userId
                                            , mobileNumber
                                            , resultOtp.id)
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

    static setLocation = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {locationId} = req.body;
            const userId = req.body.userSession.user.id
            const deviceUid = req.body.userSession.deviceUid

            const result = await setLocation(deviceUid, locationId, userId)
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

}

export default UserVerificationController ;