import { NextFunction, Request, Response } from 'express'
import e = require('express');
import { In } from 'typeorm';
import { BallotPollingStation } from '../../bases/entities/BallotPollingStation';
import { ballotPollingStationRepository, ballotRepository, ballotTypeRepository, districtRepository, pollingStationRepository, regionRepository, voterRepository } from '../../bases/repositories';
import { Election, ElectionBallotItem, ElectionBallot, ElectionPollingStation, ElectionPollingStationBallot, ElectionVotingCard } from '../entities';
import { ElectionVoter } from '../entities/ElectionVoter';
import { ElectionModel } from '../models/ElectionModel';
import { electionBallotItemRepository, electionBallotRepository, electionPollingStationRepository, electionPollingStationBallotRepository, electionRepository, electionVotingCardRepository, electionVoterRepository } from '../repositories';


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
            
            let election : Election = req.body;
            election.statusId = 1
            election = await electionRepository.save(election)

            const ballotIds = req.body.ballotIds;

            const ballots = await ballotRepository.find({relations:{ballotType: true, ballotItem: true}, where:{isActive: true }});
            const voters = await voterRepository.find({relations:{pollingStation: true}, where:{isActive: true }});

            for(var ballot of ballots)
            {
                console.log(ballot.ballotItem)

                let electionBallot = new ElectionBallot()
                electionBallot.ballot = ballot
                electionBallot.election = election
                electionBallot.code = election.code + ' - ' + ballot.code
                electionBallot.name = election.name + ' - ' + ballot.name

                electionBallot = await electionBallotRepository.save(electionBallot)   
  
                for(var ballotItem of ballot.ballotItem)
                {
                    const electionBallotItem = new ElectionBallotItem()
                    
                    electionBallotItem.code = ballotItem.code
                    electionBallotItem.name = ballotItem.name
                    electionBallotItem.electionBallot = electionBallot
                    await electionBallotItemRepository.save(electionBallotItem)
                }
            }

            const electionBallots = await electionBallotRepository.find({where: {election: {id: election.id}}})
            const pollingStations = await pollingStationRepository.find({
                relations: {district: {region: true}}, 
                where:{isActive: true, ballotPollingStations: {ballot: {id: In (ballotIds) }} }});
            
            for(var pollingStation of pollingStations )
            {
                let electionPollingStation= new ElectionPollingStation()                    
                electionPollingStation.election = election
                electionPollingStation.pollingStation = pollingStation
                electionPollingStation.district = pollingStation.district
                electionPollingStation.region = pollingStation.district.region
                electionPollingStation = await electionPollingStationRepository.save(electionPollingStation)

                for(var electionBallot of electionBallots)
                {
                    let electionPollingStationBallot = new ElectionPollingStationBallot()
                    electionPollingStationBallot.electionBallot = electionBallot
                    electionPollingStationBallot.electionPollingStation = electionPollingStation
                    electionPollingStationBallot = await electionPollingStationBallotRepository.save(electionPollingStationBallot)
                }

                for(var voter of voters.filter(e=> e.pollingStation.id == pollingStation.id))
                {
                    let electionVoter = new ElectionVoter()
                    electionVoter.voter = voter
                    electionVoter.electionPollingStation = electionPollingStation
                    electionVoter.valueDate = voter.valueDate
                    electionVoter.code = voter.code
                    electionVoter.firstName = voter.firstName
                    electionVoter.lastName = voter.lastName
                    electionVoter.birthDate = voter.birthDate
                    electionVoter = await electionVoterRepository.save(electionVoter)
                }
            }

            election.statusId = 2
            election = await electionRepository.save(election)

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