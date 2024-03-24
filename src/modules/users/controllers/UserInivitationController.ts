import { NextFunction, Request, Response } from 'express'

import { AppError } from '../../../middlewares/error';

import { UserInivitation } from '../entities';

import { userInivitationRepository, userRepository } from '../repositories';
import { dateNow } from '../../../utils';
import { serviceAddUserInivitaionAction } from '../../actions/services';





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

            const {personalId, mobile, email } = req.body; 
            const createdUserId = req.body.userSession.user.Id
            const entity = new UserInivitation();            
            entity.createdUserId = createdUserId
            entity.personalId = personalId,
            entity.mobile = mobile
            entity.email = email
            entity.expireOn =  dateNow();
            entity.statusId = 1

            await userInivitationRepository.save(entity);
            
            const sessionUid = req.body.userSession.id
            const inivitaitaionId = entity.id;
            await serviceAddUserInivitaionAction({email, inivitaitaionId, mobile,personalId, sessionUid, createdUserId })

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