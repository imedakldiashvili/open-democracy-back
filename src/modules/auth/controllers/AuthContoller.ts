import { NextFunction, Request, Response } from 'express'

import { dateNow, newGuid} from '../../../utils';

import { userPasswordRepository, userRepository, userSessionRepository } from "../repositories";
import { newOTP } from '../../otps/services';
import { loginUserService } from '../services';
import { AppError } from '../../../middlewares/error';
import { otpRepository } from '../../otps/repositories';
import { User, UserPassword } from '../../users/entities';
import { generatePasswordHash } from '../../../middlewares/security';

class AuthContoller {
    
    static signEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.body.email  
            let result = { email: email, exist: false}
            
            const users = await userRepository.find({where: {email: email.toLowerCase()}});
            if (users.length == 0)
            {
                newOTP("email", email, 1)
            }
            else
            {
                result.exist = true
            }

            return res.json(result);
        
        } catch (error) {
            next(error)
        }
    };
    
    static signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {deviceUid, email, emailOtpCode, password} = req.body;  
            
            const newEmail = email;
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

            userPassword.userId = user.id
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

    static signOut= async (req: Request, res: Response, next: NextFunction) => {
        try {

            let userSession = req.body.userSession

            console.log(req.body)

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


