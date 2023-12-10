import { LessThan } from "typeorm"
import { voterRepository, votingCardBallotRepository, votingCardRepository } from "../../votings/repositories"
import { electionRepository, electionTimePeriodRepository } from "../repositories"

export const servicePublishElection = async () => {
    let dateTime = new Date()
    var election = await electionRepository.findOne({ where: { statusId: 1, valueDatePublish: LessThan(dateTime) } })

    if (election == null) { return { message: "election_list_is_empty" } }
    if (election.statusId > 1) return { message: "election_already_published" }
    if (election.valueDatePublish > dateTime) return { message: "election_publish_time_is_less" }

    const electionId = election.id;
    var newVotingCards = await voterRepository.createQueryBuilder()
        .select(['Voter.id "voterId"', 'el_ds.election_id "electionId"', 'Voter.district_id "districtd"'])
        .leftJoin('elections_districts', 'el_ds', 'el_ds.district_id = Voter.district_id')
        .where('el_ds.election_id = :election_id', { election_id: electionId })
        .getRawMany()

    await votingCardRepository.createQueryBuilder()
        .insert()
        .values(newVotingCards)
        .execute()

    var newVotingCardsBallots = await votingCardRepository.createQueryBuilder()
        .select(['VotingCard.id "votingCardId"', 'bl.id "ballotId"', 'bl.index index'])
        .leftJoin('ballots', 'bl', 'bl.election_id = VotingCard.election_id')
        .leftJoin('ballots_districts', 'bl_ds', 'bl_ds.ballot_id = bl.id and VotingCard.district_id = bl_ds.district_id ')
        .where('"VotingCard".election_id = :election_id', { election_id: electionId })
        .getRawMany()

    await votingCardBallotRepository.createQueryBuilder()
        .insert()
        .values(newVotingCardsBallots)
        .execute()

    election.statusId = 2
    election.registeredVoters = newVotingCards.length;

    await electionRepository.save(election)

    return { message: "election_published_successfuly" };
}

export const serviceStartElection = async () => {
    let dateTimeNow = new Date()
    var election = await electionRepository.findOne({ where: { statusId: 2, valueDateStart: LessThan(dateTimeNow) } })
    if (election == null) { return { message: "election_list_is_empty" }; }

    election.statusId = 3
    await electionRepository.save(election)

    return { message: "election_started_successfuly" };
}

export const serviceUpdateElectionTimePeriod = async () => {
    let dateTimeNow = new Date()
    var election = await electionRepository.findOne({
        where: { statusId: 3 },
        relations: { timePeriods: true },
        order: { timePeriods: { id: 1 } }
    })
    if (election == null) { return { message: "election_list_is_empty" }; }

    var electionTimePeriods = election.timePeriods.filter(e => election.valueDate < e.valueDate && e.valueDate < dateTimeNow);
    if (electionTimePeriods.length == 0) { return { message: "election_time_period_not_found" }; }

    var electionTimePeriod = electionTimePeriods[0]
    election.statusId = 3
    election.valueDate = electionTimePeriod.valueDate

    electionTimePeriod.state = 1;
    await electionTimePeriodRepository.save(electionTimePeriod);
    await electionRepository.save(election)

    return { message: "election_updated_successfuly:" + election.valueDate.toString() };
}

export const serviceCloseElection = async () => {
    let dateTimeNow = new Date()
    var election = await electionRepository.findOne({
        where: { statusId: 3, valueDateFinish: LessThan(dateTimeNow) },
        relations: { timePeriods: true }
    })
    if (election == null) { return { message: "election_list_is_empty" }; }

    var  timePeriods = election.timePeriods.filter(e => e.valueDate > election.valueDate)
    if (timePeriods.length > 0) { return { message: "election_list_is_empty" }; }
    
    election.statusId = 4
    await electionRepository.save(election)

    return { message: "election_close_successfuly_successfuly" };
}

export const serviceCalculateElectionResult = async () => {
    let dateTimeNow = new Date()
    var election = await electionRepository.findOne({ where: { statusId: 4, valueDate: LessThan(dateTimeNow) } })
    if (election == null) { return { message: "election_list_is_empty" }; }

    election.statusId = 5
    await electionRepository.save(election)

    return { message: "election_result_calculated_successfuly" };
}