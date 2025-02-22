import { NextFunction, Request, Response } from 'express'
import { votingCardRepository } from '../../votings/repositories';
import { Election} from '../entities';
import { electionRepository, electionStatusRepository } from '../repositories';
import { serviceCreateElection, serviceProcessElection, servicePublishElection } from '../services';
import { Equal, MoreThan, Not } from 'typeorm';
import { ElectionStatusEnum } from '../../enums';



class ElectionControler {

    static createElection = async (req: Request, res: Response, next: NextFunction) =>{
        var templateId = req.body.templateId
        var result = await serviceCreateElection(templateId)
        return res.json(result);
    }

    static publicElection = async (req: Request, res: Response, next: NextFunction) =>{
        var electionId = req.body.electionId
        var result = await servicePublishElection(electionId)
        return res.json(result);
    }

    static processElection = async (req: Request, res: Response, next: NextFunction) =>{
        var result = await serviceProcessElection()
        return res.json(result);
    }


    static findItems = async (req: Request, res: Response, next: NextFunction) => {
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

    static findDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {electionId} = req.body;
            const Elections = await electionRepository.findOne({
                where: {id: electionId, statusSchedule: {state: MoreThan(ElectionStatusEnum.new)} },
                relations: {actualStatusSchedule: {status: true} , statusSchedule: true, ballots: {ballotType: true}}
            });
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };


    static findActiveByVoter = async (req: Request, res: Response, next: NextFunction) => {
        const {voterId} = req.body;
        try {

            const activeElectionCards = await votingCardRepository.find({
                where: {voter: {id: voterId}, statusId: 1, election: {actualStatusSchedule: {status: {stage: {isActual: true}}}} },
                relations: {voter:{district: true}, election: true, votingCardBallots: {ballot: {ballotItems: {ballotItemValues: true, ballotItemSubjects: true}, ballotType: true}}},
                order: {
                    election: {id: -1, 
                    ballots: {index:+1, ballotItems: {index:+1, ballotItemValues: {index: +1, }}}},
                    votingCardBallots: {ballot: {index:+1, ballotItems: {index:+1, ballotItemValues: {index: +1}}}} 
                }
            })

            return res.json(activeElectionCards);
        } catch (error) {
            next(error)
        }

    };

    static findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Elections = await electionRepository.find({relations: {actualStatusSchedule: { status: true}, statusSchedule: true}});
            return res.json(Elections);
        } catch (error) {
            next(error)
        }

    };




   

}

export default ElectionControler;