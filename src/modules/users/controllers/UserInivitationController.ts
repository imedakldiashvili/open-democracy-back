import { NextFunction, Request, Response } from 'express'

import { AppError, throwBadRequest } from '../../../middlewares/error';

import { UserDetail, UserInivitation } from '../entities';

import { userDetailRepository, userInivitationRepository, userRepository } from '../repositories';
import { dateNow } from '../../../utils';
import { serviceAddUserInivitaionAction } from '../../actions/services';
import { MoreThan } from 'typeorm';





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

            const {personalId, fullName, mobile, email } = req.body; 
            const createdUserId = req.body.userSession.user.id
            const entity = new UserInivitation();            
            entity.createdUserId = createdUserId
            entity.personalId = personalId,
            entity.fullName = fullName,
            entity.mobile = mobile
            entity.email = email
            entity.expireOn =  dateNow();
            entity.statusId = 1

            await userInivitationRepository.save(entity);
            
            const sessionUid = req.body.userSession.id
            const inivitaitaionId = entity.id;

            await serviceAddUserInivitaionAction({sessionUid, inivitaitaionId, createdUserId, personalId, fullName, email, mobile})

            return res.json(entity);
        } catch (error) {
            next(error)
        }
    };

    static setActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

}

export default UserInivitationController;