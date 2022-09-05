import { appDataSource } from "../../../datasources"
import { Election, ElectionBallot, ElectionBallotItem, ElectionPollingStation, ElectionPollingStationBallot, ElectionVotingCard, ElectionVoter } from "../entities";


export const electionRepository = appDataSource.getRepository(Election);
export const electionBallotRepository = appDataSource.getRepository(ElectionBallot);
export const electionBallotItemRepository = appDataSource.getRepository(ElectionBallotItem);
export const electionPollingStationRepository = appDataSource.getRepository(ElectionPollingStation);
export const electionPollingStationBallotRepository = appDataSource.getRepository(ElectionPollingStationBallot);
export const electionVotingCardRepository = appDataSource.getRepository(ElectionVotingCard);
export const electionVoterRepository = appDataSource.getRepository(ElectionVoter);
