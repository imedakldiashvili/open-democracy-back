import { NextFunction, Request, Response } from 'express'
import { otpRepository } from '../repositories';

import { AppError } from '../../../middlewares/error';
import { newOTP } from '../services';




class UserController  {
    static add = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { type, value } = req.body; 
            await newOTP(type, value, 1)
            const result = {contact: value,  message: "new_otp_send_successfuly" }
            return res.json(result);     
        
        } catch (error) {
            next(error)
        }
    };

    static  check = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type, value, code } = req.body;              
            const otps = await otpRepository.find({
                where: { isActive: true, value: value, type: type, code: code}
            });
            
            if (otps.length != 1)
            {
                throw AppError.badRequest("incorect_" + type + "_otp_code")
            }

            const otp = otps[0];

            otp.isActive = false,
            otp.updatedOn = new Date()

            await otpRepository.save(otp);
            
            const result = {contact: value,  message: "otp_checked_successfuly" }

            return res.json(result);

        } catch (error) {
            next(error)
        }

    };



}

export default UserController;

