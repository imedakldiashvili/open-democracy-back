import { Between, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm"
import { voteBallotItemRepository, votingCardBallotRepository, votingCardRepository } from "../../votings/repositories"
import { electionRepository, electionStatusRepository, electionStatusScheduleRepository } from "../repositories"
import { templateRepository, templateStatusScheduleRepository } from "../../templates/repositories"
import { delegateGroupRepository, delegateRepository } from "../../delegates/repositories"
import { Ballot, BallotItem, BallotItemValue } from "../../ballots/entities"
import { addMinutes, dateNowMilliseconds, dateNowMinute } from "../../../utils/dates"
import { Election } from "../entities"
import { ballotItemRepository, ballotItemValueRepository, ballotRepository } from "../../ballots/repositories"
import { ElectionStatusSchedule } from "../entities/ElectionStatusSchedule"
import { userDetailRepository } from "../../users/repositories"
import { ElectionStatusEnum } from "../../enums"
import { newGuid } from "../../../utils"
import { VotingCard } from "../../votings/entities"



export const serviceCreateElection = async () => {
    
    var exElections =  await electionRepository.find({where:  {actualStatusSchedule: { status: {jobProcessingFlag: true}}}})
    if (exElections.length > 0) { return {status: 0,  message: "not_complete_elections_exists"};}
    
    var resultedElections =  await electionRepository.find({
        where:  {statusSchedule: true, actualStatusSchedule: { status: {id: ElectionStatusEnum.finished }}}
    })

    
    for (var resultedElection of resultedElections)
    {
        var newElectionStatusSchedule = resultedElection.statusSchedule.filter(e => (e.state == 0) && (e.status.id = ElectionStatusEnum.result))[0]
        resultedElection.actualStatusSchedule = newElectionStatusSchedule;

        newElectionStatusSchedule.state = 2;
        await electionStatusScheduleRepository.save(newElectionStatusSchedule)
    
        resultedElection.actualStatusSchedule = newElectionStatusSchedule
        resultedElection.uid = newGuid()
        await electionRepository.save(resultedElection)
    }

    var dateValue = dateNowMinute();

    var yearMont = dateValue.getFullYear().toString() + "-" + dateNowMilliseconds().toString() 

    var template = await templateRepository.findOne({ 
        where: { isActive: true},
        relations: { templateBallots: {ballotType: true}, statusSchedule: true },
        order: {templateBallots: {index: +1}, statusSchedule: {id: +1} }
    })

    if (!template) { return {status: 0,  message: "active_template_not_found"};}

    var electon = new Election()

    var lastElection = await electionRepository.findOne({order: {id: -1}})

    var electionNumber = (lastElection == null) ? lastElection.id + 1 : 1

    electon.uid = newGuid()
    electon.code = template.code + " " + electionNumber.toString()
    electon.name = template.name + " " + electionNumber.toString()
    electon.registeredVoters = 0
    electon.participantVoters = 0
    electon.createdAt = dateValue,

    await electionRepository.save(electon);


    var templateStatusSchedule = await templateStatusScheduleRepository.find({
        where: {template: {id: template.id}},
        relations: {status: true}
    });


    for (var itemTempalteStatusSchedule of templateStatusSchedule)
    {
        var elemplateStatusSchedule = new ElectionStatusSchedule();
        elemplateStatusSchedule.election = electon;
        elemplateStatusSchedule.state = itemTempalteStatusSchedule.state,
        elemplateStatusSchedule.status = itemTempalteStatusSchedule.status,
        elemplateStatusSchedule.hasValueDate = itemTempalteStatusSchedule.hasValueMin,
        elemplateStatusSchedule.valueDateFrom = addMinutes(dateValue,  itemTempalteStatusSchedule.valueMinFrom),
        elemplateStatusSchedule.valueDateTo = addMinutes(dateValue,  itemTempalteStatusSchedule.valueMinTo)

        await electionStatusScheduleRepository.save(elemplateStatusSchedule)
        if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.new)
        {
            electon.actualStatusSchedule = elemplateStatusSchedule
            await electionRepository.save(electon);
        }

        if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.In_Progress_10)
        {
            electon.valueDateFrom = addMinutes(dateValue,  itemTempalteStatusSchedule.valueMinFrom)
            await electionRepository.save(electon);
        }

        if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.In_Progress_20)
        {
            electon.valueDateTo = addMinutes(dateValue,  itemTempalteStatusSchedule.valueMinTo)
            await electionRepository.save(electon);
        }

    }


    for (var tempateBallot of template.templateBallots)
    {
        var ballot = new Ballot()

        ballot.election = electon;
        ballot.index = tempateBallot.index,
        ballot.ballotTypeId = tempateBallot.ballotTypeId,
        ballot.code = tempateBallot.ballotType.code,
        ballot.name = tempateBallot.ballotType.name,
        
        await ballotRepository.save(ballot);
        
        var delegatesGroups = await delegateGroupRepository.find({
            relations: {delegates: {user: true}},
            order: {delegates: {numberOfSupporters: -1}}
        });

        var itemIndex = 0;
        for (var delegateGroup of delegatesGroups)
        {
            itemIndex++;
            var ballotItem = new BallotItem()
            
            ballotItem.ballot = ballot
            ballotItem.index = itemIndex;
            ballotItem.code = delegateGroup.code;
            ballotItem.name = delegateGroup.name;
            ballotItem.hasItemValue = (delegateGroup.delegates.length > 0)
            ballotItem.numberOfItemValue = delegateGroup.delegates.length > 10 ? 10 : delegateGroup.delegates.length;
            await ballotItemRepository.save(ballotItem);

            var itemValueindex = 0;
            for (var delegate of delegateGroup.delegates)
            {
                itemValueindex ++;
                var ballotItemValue = new BallotItemValue()
                ballotItemValue.ballotItem = ballotItem;
                ballotItemValue.code = delegate.user.userName
                ballotItemValue.name = delegate.user.userName
                ballotItemValue.title = delegateGroup.name
                ballotItemValue.index = itemValueindex 

                await ballotItemValueRepository.save(ballotItemValue);

            }

        }
    }



    return {status: 1,  message: "election_created_successfuly" };
}


export const serviceProcessElection = async () => {
    var election = await electionRepository.findOne({ 
        where: { actualStatusSchedule: { status: {jobProcessingFlag: true}}},
        relations: {actualStatusSchedule: {status: true}, statusSchedule: {status: true}},
        order: {statusSchedule: {status: {id: +1}}}
    })

    if (election == null) { return {status: 0,   message: "active_election_election_not_found" } }
    var actualElectionStatusSchedule = election.actualStatusSchedule;

    let dateTime = new Date()
    if (actualElectionStatusSchedule.valueDateTo >= dateTime) {return {status: 0,   message: "waiting_status_" + actualElectionStatusSchedule.status.code }}

    actualElectionStatusSchedule.state = 2
    actualElectionStatusSchedule.numberOfVoters = await votingCardRepository.count({where:{electionId: election.id,  votedAt: LessThanOrEqual(actualElectionStatusSchedule.valueDateTo)}})
                                                                
    await electionStatusScheduleRepository.save(actualElectionStatusSchedule)
    var newElectionStatusSchedule = election.statusSchedule.filter(e => (e.state == 0) && (e.status.id > actualElectionStatusSchedule.status.id))[0]

    
    if (newElectionStatusSchedule.status.id == ElectionStatusEnum.startedIn)
    {
        await servicePublishElection(election.id)
        election = await electionRepository.findOne({where: { id: election.id}})
    }

    if (newElectionStatusSchedule.status.id == ElectionStatusEnum.finished)
    {
        await serviceCompleteElectionVotingCards(election.id)
        election = await electionRepository.findOne({where: { id: election.id}})
    }

    newElectionStatusSchedule.state = newElectionStatusSchedule.status.id == ElectionStatusEnum.archive ? 2 : 1;
    await electionStatusScheduleRepository.save(newElectionStatusSchedule)

    election.actualStatusSchedule = newElectionStatusSchedule
    election.uid = newGuid()
    await electionRepository.save(election)

    return {status: 1,  message: "election_" + newElectionStatusSchedule.status.code + "_successfuly" };
}

export const servicePublishElection = async (electionId: number) => {
    var election = await electionRepository.findOne({ 
        where: { id: electionId },
        relations: {statusSchedule: {status: true}}
    })
    if (election == null) { return {status: 0,   message: "new_election_not_found" } }

    var newVotingCards = await userDetailRepository.createQueryBuilder()
        .select(['UserDetail.id "voterId"', electionId.toString() + ' "electionId"', 'UserDetail.district_id "districtId"', "1" + ' "statusId"'])
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

    election.registeredVoters = await votingCardRepository.count({where: {election: {id: electionId}}})
    await electionRepository.save(election)
    
    return {status: 1,  message: "election_published_successfuly" };
}

export const serviceCompleteElectionVotingCards = async (electionId: number) => {
    var election = await electionRepository.findOne({ 
        where: { id: electionId },
        relations: {statusSchedule: {status: true}}
    })
    
    if (election == null) { return {status: 0,   message: "new_election_not_found" } }

    await votingCardRepository.createQueryBuilder()
    .update()
    .set({ statusId: 3 })
    .where("election_id = :electionId and status_id = :statusId ", { electionId: electionId, statusId: 1 })
    .execute()

    election.participantVoters = await votingCardRepository.count({where: {election: {id: electionId}, statusId: 2}})
    await electionRepository.save(election)
    
    var ballotItems = await ballotItemRepository.find({
        where: {ballot: {election: {id: electionId}}},
        relations: {ballot: true}
    })

    for(var ballotItem of ballotItems  )
    {
        var numberOfParticipants = await voteBallotItemRepository.count({where: {ballotId: ballotItem.ballot.id}})
        var numberOfVotes = await voteBallotItemRepository.count({where: {ballotItemId: ballotItem.id}})

        ballotItem.numberOfParticipants = numberOfParticipants
        ballotItem.numberOfVotes = numberOfVotes        
        ballotItem.valuePercent = numberOfParticipants ? Math.round((numberOfVotes/numberOfParticipants)*100) : 0

        await ballotItemRepository.save(ballotItem)
    }

    return {status: 1,  message: "election__successfuly" };
}

