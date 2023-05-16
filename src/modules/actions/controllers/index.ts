import { NextFunction, Request, Response } from 'express'
import { newGuid } from '../../../utils';
import { currencyRepository } from '../../currencies/repositories';
import { Action } from '../entities';
import { actionRepository, actionTypeRepository } from '../repositories';



class ActionController {

    static addActions = async (req: Request, res: Response, next: NextFunction) => {
        
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
    
    static getUserRecentActions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRecentActions = await actionRepository
            .find({
                relations: {actionType: true, currency: true}, 
                order: {createdOn: -1},
                take: 10, 
            });
            return res.json(userRecentActions);
        } catch (error) {
            next(error)
        }
    };

    static getUserAllActions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRecentActions = await actionRepository
            .find({
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