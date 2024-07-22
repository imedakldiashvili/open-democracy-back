import { NextFunction, Request, Response } from 'express'
import { ballotTypeRepository } from '../repositories';

import { Controller, Route, Get } from 'tsoa';


class BallotTypeController {
    
    static findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const BallotTypes = await ballotTypeRepository.find();
            return res.json(BallotTypes);
        } catch (error) {
            next(error)
        }

    };

    static findDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const BallotTypes = await ballotTypeRepository.findOneBy({id: id});
            return res.json(BallotTypes);
        } catch (error) {
            next(error)
        }

    };


}

export default BallotTypeController;