import { NextFunction, Request, Response } from 'express'
import { ballotTypeRepository, districtRepository, regionRepository } from '../../bases/repositories';
import { Election } from '../entities';
import { ElectionBallot } from '../entities/ElectionBallot';
import { ElectionModel } from '../models/ElectionModel';
import { electionBallotItemRepository, electionBallotRepository, electionRepository } from '../repositories';


class ElectionControler {


    static getElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find({ 
                relations: { electionBallots: { electionBallotItems: true } },
                order: { electionBallots: { election: {id: 'desc'}, electionBallotItems : {code: 'ASC'}}} 
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static getElectionById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const Elections = await electionRepository.findOneBy({ id: id });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static addElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body)
            let election = req.body;
            election = await electionRepository.save(election)
           


            console.log(election)
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static editElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static setActiveElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

    static deleteElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("success");
        } catch (error) {
            next(error)
        }
    };

}

export default ElectionControler;