import { appDataSource } from "../../../datasources"
import { Election, ElectionBallot, ElectionBallotItem, ElectionPollingStationBallot, ElectionPollingStation, ElectionPollingStationVoter, ElectionVotingCard, ElectionVotingCardVote, } from "../entities";


export const electionRepository = appDataSource.getRepository(Election);

export const electionBallotRepository = appDataSource.getRepository(ElectionBallot);
export const electionPollingStationBallotRepository = appDataSource.getRepository(ElectionPollingStationBallot);
export const electionBallotItemRepository = appDataSource.getRepository(ElectionBallotItem);

export const electionPollingStationRepository = appDataSource.getRepository(ElectionPollingStation);
export const electionPollingStationVoterRepository = appDataSource.getRepository(ElectionPollingStationVoter);

export const electionVotingCardRepository = appDataSource.getRepository(ElectionVotingCard);
export const electionVotingCardVoteRepository = appDataSource.getRepository(ElectionVotingCardVote);
