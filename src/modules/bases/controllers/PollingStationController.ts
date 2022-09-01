import { NextFunction, Request, Response } from 'express'
import { pollingStationRepository } from '../repositories';


class PollingStationController {

    
    static getPollingStation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const PollingStations = await pollingStationRepository.find();
            return res.json(PollingStations);
        } catch (error) {
            next(error)
        }

    };

    static getPollingStationById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const PollingStations = await pollingStationRepository.findOneBy({id: id});
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