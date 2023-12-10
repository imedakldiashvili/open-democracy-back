import { NextFunction, Request, Response } from 'express'
import { userOTPRepository } from '../repositories';

import { AppError } from '../../../middlewares/error';
import { checkOTP, addOTP } from '../services';




class UserController  {
    
    static addOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, type, value } = req.body; 
            await addOTP(deviceUid, type, value, 1)
            const result = {contact: value,  message: "new_otp_send_successfuly" }
            return res.json(result);     
        
        } catch (error) {
            next(error)
        }
    };

    static  checkOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createdBy = 1
            const {deviceUid, type, value, code } = req.body;
            const result = await checkOTP(deviceUid, type, value, createdBy, code)
            return res.json(result);

        } catch (error) {
            next(error)
        }

    };



}

export default UserController;

