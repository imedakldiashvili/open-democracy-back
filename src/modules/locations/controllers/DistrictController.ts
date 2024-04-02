import { NextFunction, Request, Response } from 'express'
import { districtRepository } from '../repositories';
districtRepository

class DistrictControler {

    
    static findDistricts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Districts = await districtRepository.find({relations: {region: true}});
            return res.json(Districts);
        } catch (error) {
            next(error)
        }

    };

    static findDistrictsByRegionId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const regionId = parseInt(req.params.regionId)
            const Districts = await districtRepository.find({where: {region: {id: regionId}}, relations: {region: true}});
            return res.json(Districts);
        } catch (error) {
            next(error)
        }

    };


    static getDistrictById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const Districts = await districtRepository.findOne({ where: {id: id}, relations: {region: true}} );
            return res.json(Districts);
        } catch (error) {
            next(error)
        }

    };    

    static addDistrict = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const District = req.body;
            await districtRepository.save(District);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editDistrict = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static setActiveDistrict = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static deleteDistrict = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

}

export default DistrictControler;