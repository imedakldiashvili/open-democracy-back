import { NextFunction, Request, Response } from 'express'

import { AppError } from '../../../middlewares/error';

import { User, UserPassword } from '../entities';

import { userPasswordRepository, userRepository, userSessionRepository } from '../repositories';
import { dateNow } from '../../../utils';
import { addPassword, changeMobile, checkOTP, checkPassword, loginUserService, refreshSessionService } from '../services';





class UserController {
    
    static find = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await userRepository.find();
            return res.json(users);
        } catch (error) {
            next(error)
        }

    };

    static findDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const user = await userRepository.findOneBy({id: id});
            return res.json(user);
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

            return res.json({message: "user_logouted_successfuly"});

        } catch (error) {
            next(error)
        }
    };

    static refreshSession= async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.userSession.user.id
            const deviceUid = req.body.userSession.deviceUid
            const userSession = await refreshSessionService(userId, deviceUid)
            return res.json(userSession);

        } catch (error) {
            next(error)
        }
    };

    static changePassword= async (req: Request, res: Response, next: NextFunction) => {
        try {

            let userSession = req.body.userSession

            const userId = userSession.user.id
            const email = userSession.user.email
            const deviceUid = userSession.deviceUid
            
            const exPasswordText = req.body.exPassword
            const newPasswordText = req.body.newPassword
            const mobileNumber = req.body.newPassword
            const apptovalCode = req.body.apptovalCode

            await checkOTP('changePassword', deviceUid, "mobile", mobileNumber,  userId, apptovalCode)

            await checkPassword(userId, exPasswordText)
            
            const newPassword = await addPassword(userId, newPasswordText, userId)

            const result = await loginUserService(deviceUid, email, newPasswordText)

            return res.json(result);

        } catch (error) {
            next(error)
        }
    };

    static changeMobile= async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { mobileNumber, approvalCode } = req.body
            let userSession = req.body.userSession
            const userId = userSession.user.id
            const email = userSession.user.email
            const deviceUid = userSession.deviceUid
            await changeMobile(deviceUid, userId, mobileNumber, approvalCode)
            return res.json("result");

        } catch (error) {
            next(error)
        }
    };


}

export default UserController;