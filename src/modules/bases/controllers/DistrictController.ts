import { NextFunction, Request, Response } from 'express'
import { districtRepository } from '../repositories';
districtRepository

class DistrictControler {

    
    static getDistrict = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Districts = await districtRepository.find();
            return res.json(Districts);
        } catch (error) {
            next(error)
        }

    };

    static getDistrictById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const Districts = await districtRepository.findOneBy({id: id});
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