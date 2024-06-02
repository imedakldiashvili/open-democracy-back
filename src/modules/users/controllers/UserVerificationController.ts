import { NextFunction, Request, Response } from 'express'

import { AppError, throwBadRequest } from '../../../middlewares/error';

import { UserDetail, UserInivitation } from '../entities';

import { userDetailRepository, userInivitationRepository, userRepository } from '../repositories';
import { dateNow } from '../../../utils';
import { serviceAddUserInivitaionAction } from '../../actions/services';
import { MoreThan } from 'typeorm';
import { verification } from '../services';



class UserVerificationController {


    static verification = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {personalId, email} = req.body;
            const userId = req.body.userSession.user.id
            const deviceUid = req.body.userSession.deviceUid

            const result = await verification(deviceUid
                                            , personalId
                                            , email
                                            , userId)
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

}

export default UserVerificationController ;