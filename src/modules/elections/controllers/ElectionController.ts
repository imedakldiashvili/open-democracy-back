import { NextFunction, Request, Response } from 'express'
import { ballotRepository, ballotTypeRepository, districtRepository, regionRepository } from '../../bases/repositories';
import { Election, ElectionBallotItem } from '../entities';
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
            
            let reqElection = req.body;
            const election = await electionRepository.save(reqElection)

            for(var reqElectionBallot of reqElection.electionBallotIds)
            {
                const ballot= await ballotRepository.findOne({
                    where: {id: reqElectionBallot.ballotId}, 
                    relations: {ballotType: true, ballotItem: true}})

                let electionBallot = new ElectionBallot()
                electionBallot.election = election
                electionBallot.code = election.code + ' - ' + ballot.code
                electionBallot.name = election.name + ' - ' + ballot.name
                electionBallot.ballotType = ballot.ballotType
                electionBallot = await electionBallotRepository.save(electionBallot)
                
                console.log(ballot.ballotItem)

                for(var ballotItem of ballot.ballotItem)
                {
                    const electionBallotItem = new ElectionBallotItem()
                    
                    electionBallotItem.code = ballotItem.code
                    electionBallotItem.name = ballotItem.name
                    electionBallotItem.electionBallot = electionBallot
                    await electionBallotItemRepository.save(electionBallotItem)
                }
            }
           

            // await electionBallotItemRepository
            //     .createQueryBuilder()
            //     .insert()
            //     .into(ElectionBallotItem)
            //     .values([
            //         { name: "Timber", code: "Saw" },
            //         { firstName: "Phantom", lastName: "Lancer" },
            //     ])
            //     .execute()
           


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