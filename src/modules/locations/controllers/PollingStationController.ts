import { NextFunction, Request, Response } from 'express'
import { pollingStationRepository } from '../../ballots/repositories';


class PollingStationController {

    
    static getPollingStation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const PollingStations = await pollingStationRepository.find({relations: {district: {region: true}}});
            return res.json(PollingStations);
        } catch (error) {
            next(error)
        }

    };

    static getPollingStationById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const PollingStations = await pollingStationRepository.findOne({where:{id: id}, relations: {district: {region: true}}});
            return res.json(PollingStations);
        } catch (error) {
            next(error)
        }

    };

    static getPollingStationByDiscrictId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const districtId = parseInt(req.params.districtId)
            const PollingStations = await pollingStationRepository.find({where:{district: {id: districtId} }, relations: {district: {region: true}}});
            return res.json(PollingStations);
        } catch (error) {
            next(error)
        }

    };

    static addPollingStation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const PollingStation = req.body;
            await pollingStationRepository.save(PollingStation);
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editPollingStation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static setActivePollingStation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

    static deletePollingStation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("Not Implimented");
        } catch (error) {
            next(error)
        }
    };

}

export default PollingStationController;