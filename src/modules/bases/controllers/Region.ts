import { NextFunction, Request, Response } from 'express'
import { regionRepository } from '../repositories';


class RegionController {

    
    static getRegion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Regions = await regionRepository.find();
            return res.json(Regions);
        } catch (error) {
            next(error)
        }

    };

    static getRegionById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const Regions = await regionRepository.findOneBy({id: id});
            return res.json(Regions);
        } catch (error) {
            next(error)
        }

    };

    static addRegion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Region = req.body;
            await regionRepository.save(Region);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editRegion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static setActiveRegion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static deleteRegion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

}

export default RegionController;