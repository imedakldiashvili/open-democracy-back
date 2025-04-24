import { Between, Equal, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm"
import { voteBallotItemRepository, votegBallotItemValueRepository, votingCardBallotRepository, votingCardRepository } from "../../votings/repositories"
import { electionRepository, electionStatusRepository, electionStatusScheduleRepository } from "../repositories"
import { templateRepository, templateStatusScheduleRepository } from "../../templates/repositories"
import { delegateGroupRepository, delegateRepository } from "../../delegates/repositories"
import { Ballot, BallotItem, BallotItemValue } from "../../ballots/entities"
import { addMinutes, dateNowMilliseconds, dateNowMinute } from "../../../utils/dates"
import { Election } from "../entities"
import { ballotItemRepository, ballotItemSubjectRepository, ballotItemValueRepository, ballotItemValueVoteRepository, ballotRepository } from "../../ballots/repositories"
import { ElectionStatusSchedule } from "../entities/ElectionStatusSchedule"
import { userDetailRepository } from "../../users/repositories"
import { ElectionStatusEnum } from "../../enums"
import { newGuid } from "../../../utils"
import { VotingCard } from "../../votings/entities"
import { appDataSource } from "../../../datasources"
import { TemplateBallotItemSubject } from "../../templates/entities/TemplateBallotItemSubject"
import { BallotItemSubject } from "../../ballots/entities/BallotItemSubject"
import { BallotItemValueVote } from "../../ballots/entities/BallotItemValueVote"


export const serviceCreateElection = async (templateId: number) => {

    var exElections = await electionRepository.find({ where: { templateId: templateId, actualStatusSchedule: { status: { jobProcessingFlag: true } } } })
    if (exElections.length > 0) { return { status: 0, message: "not_complete_elections_exists" }; }

    var resultedElections = await electionRepository.find({
        where: { templateId: templateId, statusSchedule: true, actualStatusSchedule: { status: { id: ElectionStatusEnum.finished } } }
    })



    for (var resultedElection of resultedElections) {
        var newElectionStatusSchedule = resultedElection.statusSchedule.filter(e => (e.state == 0) && (e.status.id = ElectionStatusEnum.result))[0]
        resultedElection.actualStatusSchedule = newElectionStatusSchedule;

        newElectionStatusSchedule.state = 2;
        await electionStatusScheduleRepository.save(newElectionStatusSchedule)

        resultedElection.actualStatusSchedule = newElectionStatusSchedule
        resultedElection.uid = newGuid()
        await electionRepository.save(resultedElection)
    }

    var dateValue = dateNowMinute();

    var template = await templateRepository.findOne({
        where: { id: templateId, isActive: true },
        relations: {
            templateBallots: {
                ballotType: true,
                templateBallotItems: { templateBallotItemValues: true, templateBallotItemSubjects: true },
                templateBallotDistricts: true
            },
            statusSchedule: true,

        },
        order: { templateBallots: { index: +1, templateBallotItems: { index: +1, templateBallotItemValues: { index: +1 } } }, statusSchedule: { id: +1 } }
    })

    if (!template) { return { status: 0, message: "active_template_not_found" }; }


    await appDataSource.manager.transaction(async (transactionalEntityManager) => {

        var electon = new Election()
        electon.templateId = template.id
        electon.uid = newGuid()
        electon.code = template.code
        electon.name = template.name
        electon.registeredVoters = 0
        electon.participantVoters = 0
        electon.createdAt = dateValue,

            await electionRepository.save(electon);

        // electon.code = template.code + ' / ' + electon.id
        // electon.name = template.name + ' / ' + electon.id
        // await electionRepository.save(electon);


        var templateStatusSchedule = await templateStatusScheduleRepository.find({
            where: { template: { id: templateId } },
            relations: { status: true }
        });


        for (var itemTempalteStatusSchedule of templateStatusSchedule) {
            var elemplateStatusSchedule = new ElectionStatusSchedule();
            elemplateStatusSchedule.election = electon;
            elemplateStatusSchedule.state = itemTempalteStatusSchedule.state,
                elemplateStatusSchedule.status = itemTempalteStatusSchedule.status,
                elemplateStatusSchedule.hasValueDate = itemTempalteStatusSchedule.hasValueMin,
                elemplateStatusSchedule.valueDateFrom = addMinutes(dateValue, itemTempalteStatusSchedule.valueMinFrom),
                elemplateStatusSchedule.valueDateTo = addMinutes(dateValue, itemTempalteStatusSchedule.valueMinTo)

            await electionStatusScheduleRepository.save(elemplateStatusSchedule)
            if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.new) {
                electon.actualStatusSchedule = elemplateStatusSchedule
                await electionRepository.save(electon);
            }

            if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.In_Progress_10) {
                electon.valueDateFrom = addMinutes(dateValue, itemTempalteStatusSchedule.valueMinFrom)
                await electionRepository.save(electon);
            }

            if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.In_Progress_20) {
                electon.valueDateTo = addMinutes(dateValue, itemTempalteStatusSchedule.valueMinTo)
                await electionRepository.save(electon);
            }

        }

        for (var tempateBallot of template.templateBallots) {

            for (var templateBallotDistrict of tempateBallot.templateBallotDistricts) {

                var ballot = new Ballot()

                ballot.election = electon;
                ballot.index = tempateBallot.index,
                    ballot.ballotTypeId = tempateBallot.ballotTypeId,
                    ballot.code = tempateBallot.ballotType.code,
                    ballot.name = tempateBallot.ballotType.name,
                    ballot.districtId = templateBallotDistrict.districtId,

                    await ballotRepository.save(ballot);

                if (tempateBallot.ballotType.ballotSourceId == 20) {
                    var itemIndex = 0;
                    var delegatesGroups = await delegateGroupRepository.find({
                        relations: { delegates: { user: { userDetail: true } } },
                        where: { isActive: true },
                        order: { number: +1 }
                    });

                    for (var delegatesGroup of delegatesGroups) {
                        itemIndex++;
                        var ballotItem = new BallotItem()

                        ballotItem.ballot = ballot
                        ballotItem.index = delegatesGroup.number,
                            ballotItem.code = delegatesGroup.color;
                        ballotItem.name = delegatesGroup.name;
                        ballotItem.imageUrl = delegatesGroup.imageUrl;
                        ballotItem.hasItemValue = delegatesGroup.delegates.length > 0
                        ballotItem.isItemValueReadonly = true
                        ballotItem.numberOfItemValue = delegatesGroup.delegates.length;


                        await ballotItemRepository.save(ballotItem);

                        for (var delegate of delegatesGroup.delegates) {
                            var ballotItemValue = new BallotItemValue()
                            ballotItemValue.ballotItem = ballotItem;
                            ballotItemValue.index = 0
                            ballotItemValue.code = delegate.user.userDetail.code
                            ballotItemValue.name = delegate.user.userDetail.fullName
                            ballotItemValue.title = delegatesGroup.name
                            ballotItemValue.imageUrl = delegate.imageUrl
                            ballotItemValue.votedValue = 0

                            await ballotItemValueRepository.save(ballotItemValue);

                        }

                        var newBallotItemSubject = new BallotItemSubject()
                        newBallotItemSubject.ballotItem = ballotItem;
                        newBallotItemSubject.index = delegatesGroup.number
                        newBallotItemSubject.code = delegatesGroup.code
                        newBallotItemSubject.name = delegatesGroup.name
                        newBallotItemSubject.imageUrl = delegatesGroup.imageUrl

                        await ballotItemSubjectRepository.save(newBallotItemSubject);

                    }

                }

                if (tempateBallot.ballotType.ballotSourceId == 21) {
                    var delegatesGroups = await delegateGroupRepository.find({
                        relations: { delegates: { user: true } },
                        order: { number: +1 }
                    });

                    var itemIndex = 0;
                    for (var templateBallotItem of tempateBallot.templateBallotItems) {
                        itemIndex++;
                        var ballotItem = new BallotItem()

                        ballotItem.ballot = ballot
                        ballotItem.index = itemIndex;
                        ballotItem.index = templateBallotItem.index,
                            ballotItem.code = templateBallotItem.code;
                        ballotItem.name = templateBallotItem.name;
                        ballotItem.imageUrl = templateBallotItem.imageUrl;
                        ballotItem.hasItemValue = templateBallotItem.hasItemValue
                        ballotItem.isItemValueReadonly = templateBallotItem.isItemValueReadonly
                        ballotItem.numberOfItemValue = templateBallotItem.numberOfItemValue;

                        await ballotItemRepository.save(ballotItem);

                        if (!templateBallotItem.hasItemValue) { continue; }

                        var itemValueindex = 0;
                        for (var delegatesGroup of delegatesGroups) {



                            itemValueindex++;
                            var ballotItemValue = new BallotItemValue()
                            ballotItemValue.ballotItem = ballotItem;
                            ballotItemValue.code = delegatesGroup.color
                            ballotItemValue.name = delegatesGroup.name
                            ballotItemValue.title = delegatesGroup.name
                            ballotItemValue.index = delegatesGroup.number
                            ballotItemValue.imageUrl = delegatesGroup.imageUrl
                            ballotItemValue.votedValue = 0

                            await ballotItemValueRepository.save(ballotItemValue);

                        }

                    }
                }

                if (tempateBallot.ballotType.ballotSourceId == 30) {
                    var delegates = await delegateRepository.find({
                        where: { isActive: true },
                        relations: { delegateGroup: true, user: { userDetail: true } },
                        order: { numberOfSupporters: +1 }
                    });

                    if (templateBallotDistrict.districtId != 0) {
                        delegates = delegates.filter(d => d.user.userDetail.districtId == templateBallotDistrict.districtId)
                    }

                    if (delegates.length == 0) {
                        await ballotRepository.remove(ballot);
                        continue;
                    }

                    var itemIndex = 0;
                    for (var templateBallotItem of tempateBallot.templateBallotItems) {
                        itemIndex++;
                        var ballotItem = new BallotItem()

                        ballotItem.ballot = ballot
                        ballotItem.index = itemIndex;
                        ballotItem.index = templateBallotItem.index,
                            ballotItem.code = templateBallotItem.code;
                        ballotItem.name = templateBallotItem.name;
                        ballotItem.imageUrl = templateBallotItem.imageUrl;
                        ballotItem.hasItemValue = templateBallotItem.hasItemValue
                        ballotItem.isItemValueReadonly = templateBallotItem.isItemValueReadonly
                        ballotItem.numberOfItemValue = templateBallotItem.numberOfItemValue;

                        await ballotItemRepository.save(ballotItem);

                        if (!templateBallotItem.hasItemValue) { continue; }
                        var itemValueindex = 0;
                        for (var delegate of delegates) {
                            itemValueindex++;
                            var ballotItemValue = new BallotItemValue()
                            ballotItemValue.ballotItem = ballotItem;
                            ballotItemValue.code = itemValueindex.toString();
                            ballotItemValue.name = delegate.user.userDetail.fullName
                            ballotItemValue.title = delegate.delegateGroup.name
                            ballotItemValue.index = itemValueindex,
                                ballotItemValue.imageUrl = delegate.imageUrl
                            ballotItemValue.votedValue = 0

                            await ballotItemValueRepository.save(ballotItemValue);

                        }

                    }
                }


            }






        }
    })

    return { status: 1, message: "election_created_successfuly" };
}



export const serviceProcessElection = async () => {
    var election = await electionRepository.findOne({
        where: { actualStatusSchedule: { status: { jobProcessingFlag: true } } },
        relations: { actualStatusSchedule: { status: true }, statusSchedule: { status: true } },
        order: { statusSchedule: { status: { id: +1 } } }
    })

    if (election == null) { return { status: 0, message: "active_election_election_not_found" } }
    var actualElectionStatusSchedule = election.actualStatusSchedule;

    let dateTime = new Date()
    if (actualElectionStatusSchedule.valueDateTo >= dateTime) { return { status: 0, message: "waiting_status_" + actualElectionStatusSchedule.status.code } }

    actualElectionStatusSchedule.state = 2
    actualElectionStatusSchedule.numberOfVoters = await votingCardRepository.count({ where: { electionId: election.id, votedAt: LessThanOrEqual(actualElectionStatusSchedule.valueDateTo) } })

    await electionStatusScheduleRepository.save(actualElectionStatusSchedule)
    var newElectionStatusSchedule = election.statusSchedule.filter(e => (e.state == 0) && (e.status.id > actualElectionStatusSchedule.status.id))[0]


    if (newElectionStatusSchedule.status.id == ElectionStatusEnum.startedIn) {
        await servicePublishElection(election.id)
        election = await electionRepository.findOne({ where: { id: election.id } })
    }

    if (newElectionStatusSchedule.status.id == ElectionStatusEnum.finished) {
        await serviceCompleteElection(election.id)
        election = await electionRepository.findOne({ where: { id: election.id } })
    }

    newElectionStatusSchedule.state = newElectionStatusSchedule.status.id == ElectionStatusEnum.archive ? 2 : 1;
    await electionStatusScheduleRepository.save(newElectionStatusSchedule)

    election.actualStatusSchedule = newElectionStatusSchedule
    election.uid = newGuid()
    await electionRepository.save(election)

    return { status: 1, message: "election_" + newElectionStatusSchedule.status.code + "_successfuly" };
}

export const servicePublishElection = async (electionId: number) => {
    var election = await electionRepository.findOne({
        where: { id: electionId },
        relations: { statusSchedule: { status: true } }
    })
    if (election == null) { return { status: 0, message: "new_election_not_found" } }

    var newVotingCards = await userDetailRepository.createQueryBuilder()
        .select(['UserDetail.id "voterId"', electionId.toString() + ' "electionId"', 'UserDetail.district_id "districtId"', "1" + ' "statusId"'])
        .getRawMany()

    await votingCardRepository.createQueryBuilder()
        .insert()
        .values(newVotingCards)
        .execute()

    var newVotingCardsBallots = await votingCardRepository.createQueryBuilder()
        .select(['VotingCard.id "votingCardId"', 'bl.id "ballotId"', 'bl.index index'])
        .innerJoin('ballots', 'bl', 'bl.election_id = VotingCard.election_id and (VotingCard.district_id = bl.district_id or bl.district_id = 0)')
        .where('"VotingCard".election_id = :election_id', { election_id: electionId })
        .getRawMany()

    await votingCardBallotRepository.createQueryBuilder()
        .insert()
        .values(newVotingCardsBallots)
        .execute()

    election.registeredVoters = await votingCardRepository.count({ where: { election: { id: electionId } } })
    await electionRepository.save(election)

    return { status: 1, message: "election_published_successfuly" };
}

export const serviceCompleteElection = async (electionId: number) => {
    var election = await electionRepository.findOne({
        where: { id: electionId },
        relations: { statusSchedule: { status: true } }
    })

    if (election == null) { return { status: 0, message: "new_election_not_found" } }

    await votingCardRepository.createQueryBuilder()
        .update()
        .set({ statusId: -1 })
        .where("election_id = :electionId and status_id = :statusId ", { electionId: electionId, statusId: 1 })
        .execute()

    election.participantVoters = await votingCardRepository.count({ where: { election: { id: electionId }, statusId: 2 } })
    await electionRepository.save(election)

    var ballotItems = await ballotItemRepository.find({
        where: { ballot: { election: { id: electionId } } },
        relations: { ballot: true, ballotItemValues: true }
    })



    for (var ballotItem of ballotItems) {
        const ballotItemId = ballotItem.id

        var numberOfParticipants = await voteBallotItemRepository.count({ where: { ballotId: ballotItem.ballot.id } })
        var numberOfVotes = await voteBallotItemRepository.count({ where: { ballotItemId: ballotItemId } })

        ballotItem.numberOfParticipants = numberOfParticipants
        ballotItem.numberOfVotes = numberOfVotes
        ballotItem.valuePercent = numberOfParticipants ? Math.round((numberOfVotes / numberOfParticipants) * 100) : 0

        await ballotItemRepository.save(ballotItem)

        if (ballotItem.numberOfItemValue == 0) { continue; }

        const votesResult = await votegBallotItemValueRepository
            .createQueryBuilder("item")
            .where("item.ballot_item_id = :ballotItemId", { ballotItemId: ballotItemId })
            .select("item.ballot_item_value_id", "ballotItemValueId") // Select the ballot_item_value_id column
            .addSelect("item.voted_value", "votedValue")  // Select the ballot_item_value_number column
            .addSelect("COUNT(*)", "count") // Count ballot_item_value_number in each ballot_item_value_id
            .groupBy("item.voted_value") // Group by ballot_item_value_number
            .addGroupBy("item.ballot_item_value_id") // Group by ballot_item_value_id
            .orderBy("item.ballot_item_value_id")
            .addOrderBy("item.voted_value")
            .addOrderBy("count", 'DESC')
            .getRawMany(); // Get raw result (since aggregation returns custom columns)

        console.log("votesResult", votesResult)

        for (var itemballotItemValue of ballotItem.ballotItemValues) {
            var votedValueIndex = 0
            
            const itemVotesResult = votesResult.filter(e=> e.ballotItemValueId == itemballotItemValue.id);
            const numberOfVotes = itemVotesResult.filter(e=> e.votedValue > 0).length;
            
            var ballotItemValue = await ballotItemValueRepository.findOneOrFail({ where: { id: itemballotItemValue.id } })
            ballotItemValue.numberOfVotes = numberOfVotes;
            await ballotItemValueRepository.save(ballotItemValue) 
            
            while(votedValueIndex < ballotItem.numberOfItemValue)
            {
                
                votedValueIndex++
                const ballotItemValueVote = new BallotItemValueVote();
                ballotItemValueVote.ballotItemValueId = itemballotItemValue.id
                ballotItemValueVote.votedValue = votedValueIndex
                ballotItemValueVote.numberOfVotes = 0

                const votesResults = itemVotesResult.filter(e=> e.votedValue == votedValueIndex);

                console.log(itemballotItemValue.id, votedValueIndex, votesResults) 

                if (votesResults.length == 1) {
                    ballotItemValueVote.numberOfVotes = votesResults[0].count
                }
                await ballotItemValueVoteRepository.save(ballotItemValueVote)
            }
        }

        // var votedValue = 0
        // while (votedValue < ballotItem.numberOfItemValue) {
        //     votedValue++
        //     const initialVotedValue = votedValue;
        //     await setBallotItemVoteValue(ballotItemId, initialVotedValue, votedValue, ballotItem.numberOfItemValue)
        // }

    }

    return { status: 1, message: "election_complete_successfuly" };
}

const setBallotItemVoteValue = async (ballotItemId: number, initialVotedValue: number, votedValue: number, numberOfItemValue: number) => {
    const result = await ballotItemValueVoteRepository
        .createQueryBuilder("item")
        .innerJoin("item.ballotItemValue", "ballotItemValue")
        .where("ballotItemValue.voted_value = 0 and item.voted_value > 0 and item.voted_value <= :votedValue and ballotItemValue.ballot_item_id = :ballotItemId", { votedValue: votedValue, ballotItemId: ballotItemId })
        .select("item.ballot_item_value_id", "ballotItemValueId") // Select the ballot_item_value_id column
        .addSelect("ballotItemValue.ballot_item_id", "ballotItemId")
        .addSelect("MAX(item.voted_value)", "value")
        .addSelect("Count(*)", "count") // Count ballot_item_value_number in each ballot_item_value_id
        .groupBy("item.ballot_item_value_id") // Group by ballot_item_value_number
        .addGroupBy("ballotItemValue.ballot_item_id")
        .addOrderBy("count", "DESC")
        .addOrderBy("value", "ASC")
        .getRawMany(); // Get raw result (since aggregation returns custom columns)    

    if (result.length > 0) {

        const firstValue = result[0]
        const topValues = result.filter(e => e.count == firstValue.count)

        if (topValues.length == 1) {
            const itemValue = topValues[0]
            var ballotItemValue = await ballotItemValueRepository.findOneOrFail({ where: { id: itemValue.ballotItemValueId } })
            ballotItemValue.votedValue = initialVotedValue;
            await ballotItemValueRepository.save(ballotItemValue)            
            return initialVotedValue
        }
        else {
            if (votedValue < numberOfItemValue) {
                const newVotedValue = votedValue + 1
                await setBallotItemVoteValue(ballotItemId, initialVotedValue, newVotedValue, numberOfItemValue)
            }
            else {
                for (var itemValue of topValues) {
                    var ballotItemValue = await ballotItemValueRepository.findOneOrFail({ where: { id: itemValue.ballotItemValueId } })
                    ballotItemValue.votedValue = initialVotedValue;
                    await ballotItemValueRepository.save(ballotItemValue)
                    return initialVotedValue
                }
            }
        }
    }

}

