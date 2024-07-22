import { NextFunction, Request, Response } from 'express'
import { districtRepository } from '../repositories';
districtRepository

class DistrictControler {

    
    static findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Districts = await districtRepository.find({relations: {region: true}});
            return res.json(Districts);
        } catch (error) {
            next(error)
        }

    };

    static findByRegionId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const regionId = parseInt(req.params.regionId)
            const Districts = await districtRepository.find({where: {region: {id: regionId}}, relations: {region: true}});
            return res.json(Districts);
        } catch (error) {
            next(error)
        }

    };



}

export default DistrictControler;