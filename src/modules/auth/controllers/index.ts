import { NextFunction, Request, Response } from 'express'

import { throwBadRequest } from '../../../middlewares/error';
import { generateHash } from '../../../middlewares/security';

import { dateNow, newGuid } from '../../../utils';

import { userDetailRepository, userInivitationRepository, userPasswordRepository, userRepository, userSessionRepository } from "../../users/repositories";
import { addOTP, loginUserService, checkOTP, addPassword } from '../../users/services';

import { User, UserDetail, UserPassword } from '../../users/entities';
import { Like } from 'typeorm';
import { sendMail } from '../../notifications/services';

import settings from '../../../settings';

class AuthContoller {
    
    static signUpOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email} = req.body;  

            const newEmail = email.toLowerCase();
            const users = await userRepository.find({where: {email: newEmail}});
            if (users.length > 0) { throwBadRequest("email_already_exists") }

            const result = await addOTP(deviceUid, "email", email, 1)    
            const mailMsg = { from: settings.SENDGRID_FROM_EMAIL, to: result.value, subject: "Email Verification Code", html: "Email Verification Code: " + result.code }
            
            await sendMail(mailMsg)

            return res.json( { status: result.status } );
        
        } catch (error) {
            next(error)
        }
    };

    static signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email, password, emailOtpCode} = req.body;  
            
            const newEmail = email.toLowerCase();
            const users = await userRepository.find({where: {email: newEmail}});

            if (users.length > 0) { throwBadRequest("email_already_exists") }

            const  emailOtp = await checkOTP(deviceUid, "email", email,  1, emailOtpCode )
          
            const user = new User();
            user.userName = newEmail,
            user.email = newEmail,
            user.emailVerificationOtpId = emailOtp.id,
            user.isActive = true,
            user.createdBy = 1,
            user.createdOn = new Date();

            const newUser = await userRepository.save(user)
            const newPassword = await addPassword(newUser.id, password, 1)
            const result = await loginUserService(deviceUid, newEmail, password)

            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

    static signIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email, password}  = req.body
            var result = await loginUserService(deviceUid, email.toLowerCase(), password)
            return res.json(result);

        } catch (error) {
            next(error)
        }
    };

    static resetPasswordOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email} = req.body;  
            const exEmail = email.toLowerCase();
            const users = await userRepository.find({where: {email: exEmail}});
            if (users.length != 1) { throwBadRequest("email_doesnot_exists") }
            var user = users[0];
            
            const result = await addOTP(deviceUid, "email", user.email, user.id)    
            const mailMsg = { from: settings.SENDGRID_FROM_EMAIL, to: result.value, subject: "Email Verification Code", html: "Email Verification Code: " + result.code }
            
            await sendMail(mailMsg)

            return res.json( { status: result.status } );
        
        } catch (error) {
            next(error)
        }
    };

    static resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email, password, emailOtpCode} = req.body;  
            
            const newEmail = email.toLowerCase();
            const users = await userRepository.find({where: {email: newEmail}});
            if (users.length != 1) { throwBadRequest("email_already_exists") }
            const user = users[0]
            const  emailOtp = await checkOTP(deviceUid, "email", email,  1, emailOtpCode )
          
            user.updatedBy = user.id,
            user.updatedOn = new Date();

            const newUser = await userRepository.save(user)
            const newPassword = await addPassword(newUser.id, password, user.id)
            const result = await loginUserService(deviceUid, newEmail, password)

            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };

}

export default AuthContoller;


