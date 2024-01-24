import { NextFunction, Request, Response } from 'express'
import { votingCardRepository } from '../../votings/repositories';
import { Election} from '../entities';
import { electionRepository, electionStatusRepository } from '../repositories';
import { serviceCreateElection, serviceProcessElection, servicePublishElection } from '../services';
import { Equal, MoreThan, Not } from 'typeorm';
import { ElectionStatusEnum } from '../../enums';



class ElectionControler {


    static findItemsElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const elections = await electionRepository.find({
                where: {actualStatusSchedule: {status: { id: MoreThan(ElectionStatusEnum.startedIn)}}},
                relations: { actualStatusSchedule:{status: true}, statusSchedule: true}, 
                order: {id: 1}
            });
            return res.json(elections);
        } catch (error) {
            next(error)
        }

    };

    static findDetailsElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {electionId} = req.body;
            const Elections = await electionRepository.findOne({
                where: {id: electionId, statusSchedule: {state: MoreThan(ElectionStatusEnum.new)} },
                relations: {actualStatusSchedule: {status: true} , statusSchedule: true, ballots: {ballotType: true, districts: true}}
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };


    static findActiveElections = async (req: Request, res: Response, next: NextFunction) => {
        const {voterId} = req.body;
        try {

            const activeElectionCards = await votingCardRepository.find({
                where: {voter: {id: voterId}, statusId: 1 },
                relations: {voter:{district: true}, election: true, votingCardBallots: {ballot: {ballotItems: true}}},
                order: {election: {id: -1}}
            })


            return res.json(activeElectionCards);
        } catch (error) {
            next(error)
        }

    };

    static findAllElections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find({relations: {actualStatusSchedule: { status: true}, statusSchedule: true}});
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };

    static findOneElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const election = await electionRepository.findOneBy({ id: id });
            return res.json(election);
        } catch (error) {
            next(error)
        }

    };

    static addElection = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var electionStatus =  await electionStatusRepository.findOneBy({id: 1});

            let election: Election = req.body;
            
            election = await electionRepository.save(election);

            return res.json("success");

        } catch (error) {
            next(error);
        }
    }

    static setActiveElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("not implemented");
        } catch (error) {
            next(error)
        }
    };

    static deleteElection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json("nnot implementedot");
        } catch (error) {
            next(error)
        }
    };


    static createElection = async (req: Request, res: Response, next: NextFunction) =>{
        var result = await serviceCreateElection()
        return res.json(result);
    }

    static processElection = async (req: Request, res: Response, next: NextFunction) =>{
        var result = await serviceProcessElection()
        return res.json(result);
    }


    static publicElection = async (req: Request, res: Response, next: NextFunction) =>{
        var electionId = req.body.electionId
        var result = await servicePublishElection(electionId)
        return res.json(result);
    }

}

export default ElectionControler;