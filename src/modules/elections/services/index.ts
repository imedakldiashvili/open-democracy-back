import { Between, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm"
import { voteBallotItemRepository, votegBallotItemValueRepository, votingCardBallotRepository, votingCardRepository } from "../../votings/repositories"
import { electionRepository, electionStatusRepository, electionStatusScheduleRepository } from "../repositories"
import { templateRepository, templateStatusScheduleRepository } from "../../templates/repositories"
import { delegateGroupRepository, delegateRepository } from "../../delegates/repositories"
import { Ballot, BallotItem, BallotItemValue } from "../../ballots/entities"
import { addMinutes, dateNowMilliseconds, dateNowMinute } from "../../../utils/dates"
import { Election } from "../entities"
import { ballotItemRepository, ballotItemSubjectRepository, ballotItemValueRepository, ballotRepository } from "../../ballots/repositories"
import { ElectionStatusSchedule } from "../entities/ElectionStatusSchedule"
import { userDetailRepository } from "../../users/repositories"
import { ElectionStatusEnum } from "../../enums"
import { newGuid } from "../../../utils"
import { VotingCard } from "../../votings/entities"
import { appDataSource } from "../../../datasources"
import { TemplateBallotItemSubject } from "../../templates/entities/TemplateBallotItemSubject"
import { BallotItemSubject } from "../../ballots/entities/BallotItemSubject"


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
                ballot.districtId = templateBallotDistrict.districtId ,
    
                await ballotRepository.save(ballot);
    
                if (tempateBallot.ballotType.ballotSourceId == 20) {
                    var itemIndex = 0;
                    var delegatesGroups = await delegateGroupRepository.find({
                        relations: { delegates: { user: {userDetail: true} } },
                        where: {isActive: true},
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
                        ballotItem.numberOfItemValue = delegatesGroup.delegates.length ;
                        

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
                        where: {isActive: true },
                        relations: { delegateGroup: true,  user: {userDetail: true}  },
                        order: { numberOfSupporters: +1 }
                    });

                    if (templateBallotDistrict.districtId != 0)
                    {
                        delegates = delegates.filter(d=> d.user.userDetail.districtId == templateBallotDistrict.districtId)
                    }

                    if (delegates.length == 0)
                    {
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
        relations: { ballot: true }
    })

    

    for (var ballotItem of ballotItems) {
        var numberOfParticipants = await voteBallotItemRepository.count({ where: { ballotId: ballotItem.ballot.id } })
        var numberOfVotes = await voteBallotItemRepository.count({ where: { ballotItemId: ballotItem.id } })

        ballotItem.numberOfParticipants = numberOfParticipants
        ballotItem.numberOfVotes = numberOfVotes
        ballotItem.valuePercent = numberOfParticipants ? Math.round((numberOfVotes / numberOfParticipants) * 100) : 0


        if(ballotItem.numberOfItemValue > 0)
        {
            var itemNumber = 0
            // console.log("numberOfItemValue", ballotItem.code, ballotItem.numberOfItemValue )
            while(itemNumber < ballotItem.numberOfItemValue) 
            {
                itemNumber++
                const result = await votegBallotItemValueRepository
                .createQueryBuilder("item")
                .where("item.ballot_item_value_number <= :itemNumber and item.ballot_item_value_id not in (select id from public.ballots_items_values where  (voted_value = 0) and (ballot_item_value_id = :ballotItemId))", {itemNumber: itemNumber, ballotItemId: ballotItem.id})
                .select("item.ballot_item_value_id", "ballotItemValueId") // Select the ballot_item_value_id column
                .addSelect("item.ballot_item_value_number", "ballotItemValueNumber")  // Select the ballot_item_value_number column
                .addSelect("COUNT(*)", "count") // Count ballot_item_value_number in each ballot_item_value_id
                .groupBy("item.ballotItemValueNumber") // Group by ballot_item_value_number
                .addGroupBy("item.ballot_item_value_id") // Group by ballot_item_value_id
                .orderBy("item.ballot_item_value_number")
                .addOrderBy("count")
                .getRawMany(); // Get raw result (since aggregation returns custom columns)
    
                // console.log("result", itemNumber )

                if (result.length > 0)
                {
                    for(var itemValue of result.filter(e=> e.ballotItemValueNumber == itemNumber))
                    {
                        var ballotItemValue =  await ballotItemValueRepository.findOneOrFail( { where: {id: itemValue.ballotItemValueId}})
                        ballotItemValue.votedValue = itemValue.ballotItemValueNumber;
                        await ballotItemValueRepository.save(ballotItemValue)
                    }
                }                
            }
        }



        var votegBallotItemValuesPositionsGroup = votegBallotItemValueRepository.createQueryBuilder()
                                                                                .groupBy("votes_ballots_items_values.id")
                                                                                .addGroupBy("votes_ballots_items_values.ballot_item_value_number")
                                                                                .select( )




        var votegBallotItemValues = await votegBallotItemValueRepository.find({where: {ballotItemValueId:  ballotItem.id}})
        // if (!ballotItem.ballotItemValues)
        // {
        //     for(var ballotItemValue of ballotItem.ballotItemValues  )
        //     {
        //         var nummberVotedBallotItemValue =  await votegBallotItemValueRepository.count({where: {ballotItemValue: {id: ballotItemValue.id}}});
        //         ballotItemValue.votedValue = nummberVotedBallotItemValue;            
        //     }
        // }


        await ballotItemRepository.save(ballotItem)
    }

    return { status: 1, message: "election__successfuly" };
}

