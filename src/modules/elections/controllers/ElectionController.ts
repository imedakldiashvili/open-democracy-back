import { NextFunction, Request, Response } from 'express'
import { In } from 'typeorm';
import { ballotRepository,pollingStationRepository, voterRepository } from '../../bases/repositories';
import { Election, ElectionBallotItem, ElectionBallot, ElectionPollingStation, ElectionPollingStationVoter, ElectionPollingStationBallot } from '../entities';
import { electionBallotItemRepository, electionPollingStationBallotRepository, electionBallotRepository, electionPollingStationRepository, electionPollingStationVoterRepository, electionRepository } from '../repositories';


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

            let election: Election = req.body;
            election.statusId = 1;
            election = await electionRepository.save(election);

            const ballotIds = req.body.ballotIds;

            const ballots = await ballotRepository.find({ 
                relations: { ballotType: true, ballotItem: true, ballotPollingStations: {pollingStation: {district: {region: true}}} }, 
                where: { isActive: true } 
            });

            const voters = await voterRepository.find({ relations: { pollingStation: true }, where: { isActive: true }});

            // add election ballot
            for (var ballot of ballots) {
                let electionBallot = new ElectionBallot()
                electionBallot.ballot = ballot
                electionBallot.election = election
                electionBallot.code = election.code + ' - ' + ballot.code
                electionBallot.name = election.name + ' - ' + ballot.name
                electionBallot.electionBallotItems = []
                
                electionBallot = await electionBallotRepository.save(electionBallot)

                // add ElectionBallotItems
                for (var ballotItem of ballot.ballotItem) {
                    const electionBallotItem = new ElectionBallotItem()

                    electionBallotItem.code = ballotItem.code
                    electionBallotItem.name = ballotItem.name
                    electionBallotItem.electionBallot = electionBallot
                    await electionBallotItemRepository.save(electionBallotItem)
                }
            }

            // add ElectionPollingStations
            for (var ballotPollingStation of ballot.ballotPollingStations) {
                let electionPollingStation = new ElectionPollingStation()

                electionPollingStation.election = election
                electionPollingStation.pollingStation = ballotPollingStation.pollingStation 
                electionPollingStation.district  = ballotPollingStation.pollingStation.district
                electionPollingStation.region  = ballotPollingStation.pollingStation.district.region
                electionPollingStation.electionPollingStationVoters = []
                electionPollingStation = await electionPollingStationRepository.save(electionPollingStation);
                
                const electionBallots  = await electionBallotRepository.find({where: {election: {id: election.id}}})

                for(var electionBallot of electionBallots)
                {
                    const electionPollingStationBallot = new ElectionPollingStationBallot();
                    electionPollingStationBallot.electionBallot = electionBallot
                    electionPollingStationBallot.electionPollingStation = electionPollingStation
                    await electionPollingStationBallotRepository.save(electionPollingStationBallot)
                }

                // add ElectionPollingStationVoters
                for(var voter of voters.filter(e=> e.pollingStation.id == ballotPollingStation.pollingStation.id))
                {
                    let electionPollingStationVoter = new ElectionPollingStationVoter()
                    electionPollingStationVoter.electionPollingStation = electionPollingStation
                    electionPollingStationVoter.voterId = voter.id
                    electionPollingStationVoter.birthDate = voter.birthDate
                    electionPollingStationVoter.code = voter.code
                    electionPollingStationVoter.firstName = voter.firstName
                    electionPollingStationVoter.lastName = voter.lastName
                    electionPollingStationVoter.valueDate = voter.valueDate
                    electionPollingStationVoter = await electionPollingStationVoterRepository.save(electionPollingStationVoter);
                }
            }


            election.statusId = 2;
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

}

export default ElectionControler;