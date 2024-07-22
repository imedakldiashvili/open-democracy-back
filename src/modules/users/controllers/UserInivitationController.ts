import { NextFunction, Request, Response } from 'express'

import { AppError, throwBadRequest } from '../../../middlewares/error';

import { UserDetail, UserInivitation } from '../entities';

import { userDetailRepository, userInivitationRepository, userRepository } from '../repositories';
import { dateNow } from '../../../utils';
import { serviceAddUserInivitaionAction } from '../../actions/services';
import { MoreThan } from 'typeorm';
import { addUserInivitation } from '../services';





class UserInivitationController {
    
    static findBySender = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createdUserId = req.body.userSession.user.Id
            const users = await userInivitationRepository.findBy({createdUserId: createdUserId});
            return res.json(users);
        } catch (error) {
            next(error)
        }

    };
    
    static add = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {personalId, fullName, mobile, email} = req.body; 
            const createdUserId = req.body.userSession.user.id
            const sessionUid = req.body.userSession.id
            const result = await addUserInivitation( personalId, fullName, email, createdUserId, sessionUid );
            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

    static findActiveByEmailPersonalId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {personalId, email} = req.body; 
            var  userInivitations = await userInivitationRepository.find({where: {statusId: 1
                                                                                , expireOn: MoreThan(dateNow()) 
                                                                                , uid: email
                                                                                , personalId: personalId}});
            if (userInivitations.length == 1)
            {
                var userInivitation = userInivitations[0]
                return res.json(userInivitation);
            }
            return res.json(null);
        } catch (error) {
            next(error)
        }
    };


}

export default UserInivitationController;