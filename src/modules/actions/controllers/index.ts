import { NextFunction, Request, Response } from 'express'
import { newGuid } from '../../../utils';
import { currencyRepository } from '../../currencies/repositories';
import { Action } from '../entities';
import { actionRepository, actionTypeRepository } from '../repositories';
import { serviceGetActionDetail } from '../services';



class ActionController {

    static add = async (req: Request, res: Response, next: NextFunction) => {
        
        const { actionTypeId, hasCurrency, CurrencyId } = req.body
        
        try {
            const actionType = await  actionTypeRepository.findOne({where: {id: actionTypeId}})
            const action = new Action ()
            action.id = newGuid()
            action.actionType = actionType
            if (hasCurrency)
            {
                const currency = hasCurrency ? await currencyRepository.findOne({where: {id: actionTypeId}}) : null
                action.currency = currency
            }
            await actionRepository.save(action);
            return res.json(action);
        } catch (error) {
            next(error)
        }
    };

    static findDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id, actionId, userSession} = req.body;
            const userId = userSession.UserId;
            const result = await  serviceGetActionDetail({id, actionId, userId})

            return res.json(result);
        } catch (error) {
            next(error)
        }
    };

    
    static findRecentByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {            
            const userSession = req.body.userSession;
            const userRecentActions = await actionRepository
            .find({
                where: {createdBy: userSession.user.id},
                relations: {actionType: true, currency: true}, 
                order: {createdOn: -1},
                take: 10, 
            });
            return res.json(userRecentActions);
        } catch (error) {
            next(error)
        }
    };

    static findAllByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userSession = req.body.userSession;
            const userRecentActions = await actionRepository
            .find({
                where: {createdBy: userSession.user.id},
                relations: {actionType: true, currency: true}, 
                order: {createdOn: -1},
            });
            return res.json(userRecentActions);
        } catch (error) {
            next(error)
        }
    };






}

export default ActionController;