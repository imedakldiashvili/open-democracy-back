import { NextFunction, Request, Response } from 'express'

import { dateNow, newGuid } from '../../../utils';

import { userPasswordRepository, userRepository, userSessionRepository } from "../../users/repositories";
import { newOTP } from '../../otps/services';
import { loginUserService, getLoginUser, createSession } from '../services';
import { AppError } from '../../../middlewares/error';
import { otpRepository } from '../../otps/repositories';
import { User, UserPassword } from '../entities';
import { generatePasswordHash } from '../../../middlewares/security';

class AuthContoller {
    
    static signUpEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email } = req.body;  
            await newOTP(deviceUid, "email", email, 1)          

            return res.json("ok");
        
        } catch (error) {
            next(error)
        }
    };

    static signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email, password, emailOtpCode} = req.body;  
            
            const newEmail = email.toLowerCase();
            const users = await userRepository.find({where: {email: newEmail}});

            if (users.length > 0) {throw AppError.badRequest("email_already_exists") }

            const emailOtps = await otpRepository.find({where: {type: "email", value: newEmail, code: emailOtpCode, isActive: true}});

            if (emailOtps.length != 1)
            {
                throw AppError.badRequest("incorect_email_otp_code")
            }

            const emailOtp = emailOtps[0]

            if (emailOtp.expirationDate < dateNow())
            {
                throw AppError.badRequest("email_otp_code_is_expired")
            }

            if (emailOtpCode != emailOtp.code)
            {
                throw AppError.badRequest("incorect_email_otp_code")
            }
          
            const user = new User();            
            user.email = newEmail;
            user.emailVerificationOtpId = emailOtp.id,

            user.mobileIsVerified = false,
            user.clientIsVerified = false,

            user.isActive = true,
            user.createdBy = 1,
            user.createdOn = new Date();

            const newUser = await userRepository.save(user)

            const passwordSalt = newGuid();
            const passwordHash = generatePasswordHash(password,passwordSalt)
            const userPassword = new UserPassword()

            userPassword.userId = newUser.id
            userPassword.passwordSalt = passwordSalt
            userPassword.passwordHash = passwordHash
            userPassword.isActive = true
            userPassword.isTemporary = false
            userPassword.createdBy = 1
            userPassword.createdOn = new Date()

            const resUserPassword = await userPasswordRepository.save(userPassword)

            var result = await loginUserService(deviceUid, newEmail, password)

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

    static signInLocal = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email}  = req.body
            var loginUser = await getLoginUser(email)
            var result = await createSession(loginUser, deviceUid, true)
            
            return res.json(result);

        } catch (error) {
            next(error)
        }
    };

    static signOut= async (req: Request, res: Response, next: NextFunction) => {
        try {

            let userSession = req.body.userSession

            userSession.isActive = false
            userSession.updatedAt = dateNow()

            await userSessionRepository.save(userSession)

            return res.json({message: "User logouted successfuly !"});

        } catch (error) {
            next(error)
        }
    };

}

export default AuthContoller;


