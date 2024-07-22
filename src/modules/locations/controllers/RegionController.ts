import { NextFunction, Request, Response } from 'express'
import { regionRepository } from '../repositories';


class RegionController {
    
    static findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Regions = await regionRepository.find({relations: {districts: true}});
            return res.json(Regions);
        } catch (error) {
            next(error)
        }

    };

    static findDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const Regions = await regionRepository.findOne({where: {id: id}});
            return res.json(Regions);
        } catch (error) {
            next(error)
        }

    };

}

export default RegionController;