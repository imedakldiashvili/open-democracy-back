import { Between, Equal, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm"
import { voteBallotItemRepository, votedBallotItemValueRepository , votingCardBallotRepository, votingCardRepository } from "../../votings/repositories"
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


const getActiveTemplate = async (templateId: number) => {
    return templateRepository.findOne({
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
}

const getActualElections = async (templateId: number) => {
    return electionRepository.find({
        where: { templateId: templateId, isActual: true },
        relations: { statusSchedule: { status: true }, actualStatusSchedule: { status: true } }
    })
}

const updateExistingElection = async (
    transactionalEntityManager: any,
    template: any,
    actualElection: Election
) => {
    const electon = actualElection
    electon.uid = newGuid()
    electon.code = template.code
    electon.name = template.name
    electon.isPermanent = template.isPermanent
    await transactionalEntityManager.save(Election, electon)

    return electon
}

const createNewElection = async (
    transactionalEntityManager: any,
    templateId: number,
    template: any,
    dateValue: Date
) => {
    const electon = new Election()
    electon.templateId = template.id
    electon.uid = newGuid()
    electon.code = template.code
    electon.name = template.name
    electon.registeredVoters = 0
    electon.participantVoters = 0
    electon.createdAt = dateValue
    electon.isPermanent = template.isPermanent
    electon.isActual = true

    await transactionalEntityManager.save(Election, electon)

    const templateStatusSchedule = await templateStatusScheduleRepository.find({
        where: { template: { id: templateId } },
        relations: { status: true }
    });

    for (const itemTempalteStatusSchedule of templateStatusSchedule) {
        const elemplateStatusSchedule = new ElectionStatusSchedule();
        elemplateStatusSchedule.election = electon;
        elemplateStatusSchedule.state = itemTempalteStatusSchedule.state
        elemplateStatusSchedule.status = itemTempalteStatusSchedule.status
        elemplateStatusSchedule.hasValueDate = itemTempalteStatusSchedule.hasValueMin
        elemplateStatusSchedule.valueDateFrom = addMinutes(dateValue, itemTempalteStatusSchedule.valueMinFrom)
        elemplateStatusSchedule.valueDateTo = addMinutes(dateValue, itemTempalteStatusSchedule.valueMinTo)

        await transactionalEntityManager.save(ElectionStatusSchedule, elemplateStatusSchedule)
        if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.new) {
            electon.actualStatusSchedule = elemplateStatusSchedule
            await transactionalEntityManager.save(Election, electon)
        }

        if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.In_Progress_10) {
            electon.valueDateFrom = addMinutes(dateValue, itemTempalteStatusSchedule.valueMinFrom)
            await transactionalEntityManager.save(Election, electon)
        }

        if (itemTempalteStatusSchedule.status.id == ElectionStatusEnum.In_Progress_20) {
            electon.valueDateTo = addMinutes(dateValue, itemTempalteStatusSchedule.valueMinTo)
            await transactionalEntityManager.save(Election, electon)
        }
    }

    return electon
}

const syncNewElectionBallotsAndChildren = async (
    transactionalEntityManager: any,
    template: any,
    electon: Election
) => {
    for (const tempateBallot of template.templateBallots) {
        for (const templateBallotDistrict of tempateBallot.templateBallotDistricts) {
            const ballot = new Ballot()
            ballot.election = electon
            ballot.index = tempateBallot.index
            ballot.ballotTypeId = tempateBallot.ballotTypeId
            ballot.code = tempateBallot.ballotType.code
            ballot.name = tempateBallot.ballotType.name
            ballot.districtId = templateBallotDistrict.districtId
            await transactionalEntityManager.save(Ballot, ballot)

            if (tempateBallot.ballotType.ballotSourceId == 20) {
                const delegatesGroups = await delegateGroupRepository.find({
                    relations: { delegates: { user: { userDetail: true } } },
                    where: { isActive: true },
                    order: { number: +1 }
                });

                for (const delegatesGroup of delegatesGroups) {
                    const ballotItem = new BallotItem()
                    ballotItem.ballot = ballot
                    ballotItem.index = delegatesGroup.number
                    ballotItem.code = delegatesGroup.color
                    ballotItem.name = delegatesGroup.name
                    ballotItem.imageUrl = delegatesGroup.imageUrl
                    ballotItem.hasItemValue = delegatesGroup.delegates.length > 0
                    ballotItem.isItemValueReadonly = true
                    ballotItem.numberOfItemValue = delegatesGroup.delegates.length
                    ballotItem.externalId = delegatesGroup.id
                    await transactionalEntityManager.save(BallotItem, ballotItem)

                    for (const delegate of delegatesGroup.delegates) {
                        const ballotItemValue = new BallotItemValue()
                        ballotItemValue.ballotItem = ballotItem
                        ballotItemValue.index = 0
                        ballotItemValue.code = delegate.user.userDetail.code
                        ballotItemValue.name = delegate.user.userDetail.fullName
                        ballotItemValue.title = delegatesGroup.name
                        ballotItemValue.imageUrl = delegate.imageUrl
                        ballotItemValue.votedValue = 0
                        ballotItemValue.externalId = delegate.id
                        await transactionalEntityManager.save(BallotItemValue, ballotItemValue)
                    }

                    const newBallotItemSubject = new BallotItemSubject()
                    newBallotItemSubject.ballotItem = ballotItem
                    newBallotItemSubject.index = delegatesGroup.number
                    newBallotItemSubject.code = delegatesGroup.code
                    newBallotItemSubject.name = delegatesGroup.name
                    newBallotItemSubject.imageUrl = delegatesGroup.imageUrl
                    await transactionalEntityManager.save(BallotItemSubject, newBallotItemSubject)
                }
            }

            if (tempateBallot.ballotType.ballotSourceId == 21) {
                const delegatesGroups = await delegateGroupRepository.find({
                    relations: { delegates: { user: true } },
                    order: { number: +1 }
                });

                for (const templateBallotItem of tempateBallot.templateBallotItems) {
                    const ballotItem = new BallotItem()
                    ballotItem.ballot = ballot
                    ballotItem.index = templateBallotItem.index
                    ballotItem.code = templateBallotItem.code
                    ballotItem.name = templateBallotItem.name
                    ballotItem.imageUrl = templateBallotItem.imageUrl
                    ballotItem.hasItemValue = templateBallotItem.hasItemValue
                    ballotItem.isItemValueReadonly = templateBallotItem.isItemValueReadonly
                    ballotItem.numberOfItemValue = templateBallotItem.numberOfItemValue
                    ballotItem.externalId = templateBallotItem.id
                    await transactionalEntityManager.save(BallotItem, ballotItem)

                    if (!templateBallotItem.hasItemValue) { continue; }

                    for (const delegatesGroup of delegatesGroups) {
                        const ballotItemValue = new BallotItemValue()
                        ballotItemValue.ballotItem = ballotItem
                        ballotItemValue.code = delegatesGroup.color
                        ballotItemValue.name = delegatesGroup.name
                        ballotItemValue.title = delegatesGroup.name
                        ballotItemValue.index = delegatesGroup.number
                        ballotItemValue.imageUrl = delegatesGroup.imageUrl
                        ballotItemValue.votedValue = 0
                        ballotItemValue.externalId = delegatesGroup.id
                        await transactionalEntityManager.save(BallotItemValue, ballotItemValue)
                    }
                }
            }

            if (tempateBallot.ballotType.ballotSourceId == 30) {
                let delegates = await delegateRepository.find({
                    where: { isActive: true },
                    relations: { delegateGroup: true, user: { userDetail: true } },
                    order: { numberOfSupporters: +1 }
                });

                if (templateBallotDistrict.districtId != 0) {
                    delegates = delegates.filter(d => d.user.userDetail.districtId == templateBallotDistrict.districtId)
                }

                if (delegates.length == 0) { continue; }

                for (const templateBallotItem of tempateBallot.templateBallotItems) {
                    const ballotItem = new BallotItem()
                    ballotItem.ballot = ballot
                    ballotItem.index = templateBallotItem.index
                    ballotItem.code = templateBallotItem.code
                    ballotItem.name = templateBallotItem.name
                    ballotItem.imageUrl = templateBallotItem.imageUrl
                    ballotItem.hasItemValue = templateBallotItem.hasItemValue
                    ballotItem.isItemValueReadonly = templateBallotItem.isItemValueReadonly
                    ballotItem.numberOfItemValue = templateBallotItem.numberOfItemValue
                    ballotItem.externalId = templateBallotItem.id
                    await transactionalEntityManager.save(BallotItem, ballotItem)

                    if (!templateBallotItem.hasItemValue) { continue; }
                    let itemValueindex = 0;
                    for (const delegate of delegates) {
                        itemValueindex++;
                        const ballotItemValue = new BallotItemValue()
                        ballotItemValue.ballotItem = ballotItem
                        ballotItemValue.code = itemValueindex.toString()
                        ballotItemValue.name = delegate.delegateName
                        ballotItemValue.title = delegate.delegateGroup.name
                        ballotItemValue.index = itemValueindex
                        ballotItemValue.imageUrl = delegate.imageUrl
                        ballotItemValue.votedValue = 0
                        ballotItemValue.externalId = delegate.id
                        await transactionalEntityManager.save(BallotItemValue, ballotItemValue)
                    }
                }
            }
        }
    }
}

const syncExElectionBallotsAndChildren = async (
    transactionalEntityManager: any,
    template: any,
    electon: Election
) => {
    for (const tempateBallot of template.templateBallots) {
        for (const templateBallotDistrict of tempateBallot.templateBallotDistricts) {
            let ballot = await ballotRepository.findOne({
                where: {
                    electionId: electon.id,
                    districtId: templateBallotDistrict.districtId,
                    ballotTypeId: tempateBallot.ballotTypeId
                }
            })

            if (!ballot) {
                ballot = new Ballot()
                ballot.election = electon;
                ballot.index = tempateBallot.index
                ballot.ballotTypeId = tempateBallot.ballotTypeId
                ballot.code = tempateBallot.ballotType.code
                ballot.name = tempateBallot.ballotType.name
                ballot.districtId = templateBallotDistrict.districtId

                await transactionalEntityManager.save(Ballot, ballot)
            }

            if (tempateBallot.ballotType.ballotSourceId == 20) {
                const delegatesGroups = await delegateGroupRepository.find({
                    relations: { delegates: { user: { userDetail: true } } },
                    where: { isActive: true },
                    order: { number: +1 }
                });

                for (const delegatesGroup of delegatesGroups) {
                    let ballotItem = await ballotItemRepository.findOne({
                        where: { ballot: { id: ballot.id }, externalId: delegatesGroup.id }
                    })

                    if (!ballotItem) {
                        ballotItem = new BallotItem()
                        ballotItem.ballot = ballot
                        ballotItem.index = delegatesGroup.number
                        ballotItem.code = delegatesGroup.color
                        ballotItem.name = delegatesGroup.name
                        ballotItem.imageUrl = delegatesGroup.imageUrl
                        ballotItem.hasItemValue = delegatesGroup.delegates.length > 0
                        ballotItem.isItemValueReadonly = true
                        ballotItem.numberOfItemValue = delegatesGroup.delegates.length
                        ballotItem.externalId = delegatesGroup.id
                        await transactionalEntityManager.save(BallotItem, ballotItem)
                    }

                    for (const delegate of delegatesGroup.delegates) {
                        const existValue = await ballotItemValueRepository.findOne({
                            where: { ballotItem: { id: ballotItem.id }, externalId: delegate.id }
                        })
                        if (existValue) { continue; }

                        const ballotItemValue = new BallotItemValue()
                        ballotItemValue.ballotItem = ballotItem
                        ballotItemValue.index = 0
                        ballotItemValue.code = delegate.user.userDetail.code
                        ballotItemValue.name = delegate.user.userDetail.fullName
                        ballotItemValue.title = delegatesGroup.name
                        ballotItemValue.imageUrl = delegate.imageUrl
                        ballotItemValue.votedValue = 0
                        ballotItemValue.externalId = delegate.id
                        await transactionalEntityManager.save(BallotItemValue, ballotItemValue)
                    }

                    const exSubject = await ballotItemSubjectRepository.findOne({
                        where: { ballotItem: { id: ballotItem.id }, code: delegatesGroup.code }
                    })
                    if (!exSubject) {
                        const newBallotItemSubject = new BallotItemSubject()
                        newBallotItemSubject.ballotItem = ballotItem
                        newBallotItemSubject.index = delegatesGroup.number
                        newBallotItemSubject.code = delegatesGroup.code
                        newBallotItemSubject.name = delegatesGroup.name
                        newBallotItemSubject.imageUrl = delegatesGroup.imageUrl
                        await transactionalEntityManager.save(BallotItemSubject, newBallotItemSubject)
                    }
                }
            }

            if (tempateBallot.ballotType.ballotSourceId == 21) {
                const delegatesGroups = await delegateGroupRepository.find({
                    relations: { delegates: { user: true } },
                    order: { number: +1 }
                });

                for (const templateBallotItem of tempateBallot.templateBallotItems) {
                    let ballotItem = await ballotItemRepository.findOne({
                        where: { ballot: { id: ballot.id }, externalId: templateBallotItem.id }
                    })
                    if (!ballotItem) {
                        ballotItem = new BallotItem()
                        ballotItem.ballot = ballot
                        ballotItem.index = templateBallotItem.index
                        ballotItem.code = templateBallotItem.code
                        ballotItem.name = templateBallotItem.name
                        ballotItem.imageUrl = templateBallotItem.imageUrl
                        ballotItem.hasItemValue = templateBallotItem.hasItemValue
                        ballotItem.isItemValueReadonly = templateBallotItem.isItemValueReadonly
                        ballotItem.numberOfItemValue = templateBallotItem.numberOfItemValue
                        ballotItem.externalId = templateBallotItem.id
                        await transactionalEntityManager.save(BallotItem, ballotItem)
                    }

                    if (!templateBallotItem.hasItemValue) { continue; }

                    for (const delegatesGroup of delegatesGroups) {
                        const existValue = await ballotItemValueRepository.findOne({
                            where: { ballotItem: { id: ballotItem.id }, externalId: delegatesGroup.id }
                        })
                        if (existValue) { continue; }

                        const ballotItemValue = new BallotItemValue()
                        ballotItemValue.ballotItem = ballotItem
                        ballotItemValue.code = delegatesGroup.color
                        ballotItemValue.name = delegatesGroup.name
                        ballotItemValue.title = delegatesGroup.name
                        ballotItemValue.index = delegatesGroup.number
                        ballotItemValue.imageUrl = delegatesGroup.imageUrl
                        ballotItemValue.votedValue = 0
                        ballotItemValue.externalId = delegatesGroup.id
                        await transactionalEntityManager.save(BallotItemValue, ballotItemValue)

                    }
                }
            }

            if (tempateBallot.ballotType.ballotSourceId == 30) {
                let delegates = await delegateRepository.find({
                    where: { isActive: true },
                    relations: { delegateGroup: true, user: { userDetail: true } },
                    order: { numberOfSupporters: +1 }
                });

                if (templateBallotDistrict.districtId != 0) {
                    delegates = delegates.filter(d => d.user.userDetail.districtId == templateBallotDistrict.districtId)
                }

                if (delegates.length == 0) { continue; }

                for (const templateBallotItem of tempateBallot.templateBallotItems) {
                    let ballotItem = await ballotItemRepository.findOne({
                        where: { ballot: { id: ballot.id }, externalId: templateBallotItem.id }
                    })
                    if (!ballotItem) {
                        ballotItem = new BallotItem()
                        ballotItem.ballot = ballot
                        ballotItem.index = templateBallotItem.index
                        ballotItem.code = templateBallotItem.code
                        ballotItem.name = templateBallotItem.name
                        ballotItem.imageUrl = templateBallotItem.imageUrl
                        ballotItem.hasItemValue = templateBallotItem.hasItemValue
                        ballotItem.isItemValueReadonly = templateBallotItem.isItemValueReadonly
                        ballotItem.numberOfItemValue = templateBallotItem.numberOfItemValue
                        ballotItem.externalId = templateBallotItem.id
                        await transactionalEntityManager.save(BallotItem, ballotItem)
                    }

                    if (!templateBallotItem.hasItemValue) { continue; }
                    let itemValueindex = 0;
                    for (const delegate of delegates) {
                        itemValueindex++;
                        const exValue = await ballotItemValueRepository.findOne({
                            where: { ballotItem: { id: ballotItem.id }, externalId: delegate.id }
                        })
                        if (exValue) { continue; }

                        const ballotItemValue = new BallotItemValue()
                        ballotItemValue.ballotItem = ballotItem
                        ballotItemValue.code = itemValueindex.toString()
                        ballotItemValue.name = delegate.delegateName
                        ballotItemValue.title = delegate.delegateGroup.name
                        ballotItemValue.index = itemValueindex
                        ballotItemValue.imageUrl = delegate.imageUrl
                        ballotItemValue.votedValue = 0
                        ballotItemValue.externalId = delegate.id
                        await transactionalEntityManager.save(BallotItemValue, ballotItemValue)
                    }
                }
            }
        }
    }
}

export const serviceCreateElection = async (templateId: number) => {
    const dateValue = dateNowMinute();

    const template = await getActiveTemplate(templateId)
    if (!template) { return { status: 0, message: "active_template_not_found" }; }

    const actualElections = await getActualElections(templateId)
    if (actualElections.length > 1) { return { status: 0, message: "multiple_actual_elections_exists" }; }

    await appDataSource.manager.transaction(async (transactionalEntityManager) => {
        if (actualElections.length == 1) {
            const electon = await updateExistingElection(transactionalEntityManager, template, actualElections[0])
            await syncExElectionBallotsAndChildren(transactionalEntityManager, template, electon)
        } else {
            const electon = await createNewElection(transactionalEntityManager, templateId, template, dateValue)
            await syncNewElectionBallotsAndChildren(transactionalEntityManager, template, electon)
        }
    })

    return { status: 1, message: actualElections.length == 1 ? "election_updated_successfuly" : "election_created_successfuly" };
}

export const serviceProcessElection = async () => {
    var election = await electionRepository.findOne({
        where: { actualStatusSchedule: { status: { jobProcessingFlag: true } } },
        relations: { actualStatusSchedule: { status: true }, statusSchedule: { status: true } },
        order: { statusSchedule: { status: { id: +1 } } }
    })

    if (election == null) { return { status: 0, message: "active_election_election_not_found" } }
    var actualElectionStatusSchedule = election.actualStatusSchedule;

    var result = await serviceCalculateElectionResults(election.id)

    let dateTime = new Date()
    if (actualElectionStatusSchedule.valueDateTo >= dateTime) { return { status: 0, message: "waiting_status_" + actualElectionStatusSchedule.status.code } }

    actualElectionStatusSchedule.state = 2
    actualElectionStatusSchedule.numberOfVoters = await votingCardRepository.count({ where: { electionId: election.id, votedAt: LessThanOrEqual(actualElectionStatusSchedule.valueDateTo) } })

    await electionStatusScheduleRepository.save(actualElectionStatusSchedule)
    var newElectionStatusSchedule = election.statusSchedule.filter(e => (e.state == 0) && (e.status.id > actualElectionStatusSchedule.status.id))[0]

    election = await electionRepository.findOne({ where: { id: election.id } })

    if (newElectionStatusSchedule.status.id == ElectionStatusEnum.startedIn) {
        await servicePublishElection(election.id)
    }
    if (newElectionStatusSchedule.status.id == ElectionStatusEnum.archive) {
        console.log("archive election", election.id)
        const result = await serviceArchiveElection(election.id)
        console.log("archive election result", result)
    }

    newElectionStatusSchedule.state = newElectionStatusSchedule.status.id == ElectionStatusEnum.archive ? 2 : 1;
    await electionStatusScheduleRepository.save(newElectionStatusSchedule)

    election.actualStatusSchedule = newElectionStatusSchedule
    election.uid = newGuid()
    await electionRepository.save(election)

    if (newElectionStatusSchedule.status.id == ElectionStatusEnum.finished) {
        await votingCardRepository.createQueryBuilder()
        .update()
        .set({ statusId: -1 })
        .where("election_id = :electionId and status_id = :statusId ", { electionId: election.id, statusId: 1 })
        .execute()
    }

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

export const serviceArchiveElection = async (electionId: number) => {
    const election = await electionRepository.findOne({ where: { id: electionId } })
    if (election == null) { return { status: 0, message: "new_election_not_found" } }

    await appDataSource.transaction(async (transactionalEntityManager) => {
        // Transfer ballots -> elections_ballots
        console.log("// Transfer ballots -> elections_ballots")
        await transactionalEntityManager.query(
            `INSERT INTO elections_ballots
                (id, "index", code, name, district_id, election_id, ballot_type_id)
            SELECT b.id, b."index", b.code, b.name, b.district_id, $1, b.ballot_type_id
            FROM ballots b
            WHERE b.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_ballots eb
                WHERE eb.election_id = $1
                  AND eb.id = b.id
              )`,
            [electionId]
        )

        // Transfer ballots_items -> elections_ballots_items
        console.log("// Transfer ballots_items -> elections_ballots_items")
        await transactionalEntityManager.query(
            `INSERT INTO elections_ballots_items
                (id, "index", code, name, image_url, has_item_value, is_item_value_readonly, number_of_item_value, number_of_votes, number_of_participants, value_percent, external_id, election_ballot_id)
            SELECT bi.id, bi."index", bi.code, bi.name, bi.image_url, bi.has_item_value, bi.is_item_value_readonly, bi.number_of_item_value, bi.number_of_votes, bi.number_of_participants, bi.value_percent, bi.external_id, bi.ballot_id
            FROM ballots_items bi
            INNER JOIN ballots b ON b.id = bi.ballot_id
            WHERE b.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_ballots_items ebi
                WHERE ebi.id = bi.id
                  AND ebi.election_ballot_id = bi.ballot_id
              )`,
            [electionId]
        )

        // Transfer ballots_items_values -> elections_ballots_items_values
        console.log("// Transfer ballots_items_values -> elections_ballots_items_values")
        await transactionalEntityManager.query(
            `INSERT INTO elections_ballots_items_values
                (id, "index", code, title, name, image_url, voted_value, voted_position, voted, external_id, number_of_votes, election_ballot_item_id)
            SELECT biv.id, biv."index", biv.code, biv.title, biv.name, biv.image_url, biv.voted_value, biv.voted_position, biv.voted, biv.external_id, biv.number_of_votes, bi.id
            FROM ballots_items_values biv
            INNER JOIN ballots_items bi ON bi.id = biv.ballot_item_id
            INNER JOIN ballots b ON b.id = bi.ballot_id
            WHERE b.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_ballots_items_values ebiv
                WHERE ebiv.id = biv.id
                  AND ebiv.election_ballot_item_id = bi.id
              )`,
            [electionId]
        )

        // Transfer ballots_items_subjects -> elections_ballots_items_subjects
        console.log("// Transfer ballots_items_subjects -> elections_ballots_items_subjects")
        await transactionalEntityManager.query(
            `INSERT INTO elections_ballots_items_subjects
                (id, "index", code, name, image_url, election_ballot_item_id)
            SELECT bis.id, bis."index", bis.code, bis.name, bis.image_url, bi.id
            FROM ballots_items_subjects bis
            INNER JOIN ballots_items bi ON bi.id = bis.ballot_item_id
            INNER JOIN ballots b ON b.id = bi.ballot_id
            WHERE b.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_ballots_items_subjects ebis
                WHERE ebis.id = bis.id
                  AND ebis.election_ballot_item_id = bi.id
              )`,
            [electionId]
        )

        // Transfer ballots_items_values_votes -> elections_ballots_items_values_votes
        console.log("// Transfer ballots_items_values_votes -> elections_ballots_items_values_votes")
        await transactionalEntityManager.query(
            `INSERT INTO elections_ballots_items_values_votes
                (id, voted_value, number_of_votes, election_ballot_item_value_id)
            SELECT bivv.id, bivv.voted_value, bivv.number_of_votes, biv.id
            FROM ballots_items_values_votes bivv
            INNER JOIN ballots_items_values biv ON biv.id = bivv.ballot_item_value_id
            INNER JOIN ballots_items bi ON bi.id = biv.ballot_item_id
            INNER JOIN ballots b ON b.id = bi.ballot_id
            WHERE b.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_ballots_items_values_votes ebivv
                WHERE ebivv.id = bivv.id
                  AND ebivv.election_ballot_item_value_id = biv.id
              )`,
            [electionId]
        )

        // Transfer votings_cards -> elections_voting_cards
        console.log("// Transfer votings_cards -> elections_voting_cards")
        await transactionalEntityManager.query(
            `INSERT INTO elections_votings_cards
                (id, election_id, voter_id, district_id, status_id, created_at, voted_at)
            SELECT vc.id, $1, vc.voter_id, vc.district_id, vc.status_id, vc.created_at, vc.voted_at
            FROM votings_cards vc
            WHERE vc.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_votings_cards evc
                WHERE evc.id = vc.id
                  AND evc.election_id = $1
              )`,
            [electionId]
        )

        // Transfer votings_cards_ballots -> elections_voting_cards_ballots
        console.log("// Transfer votings_cards_ballots -> elections_votings_cards_ballots")
        await transactionalEntityManager.query(
            `INSERT INTO elections_votings_cards_ballots
                (id, "index", election_voting_card_id, election_ballot_id)
            SELECT vcb.id, vcb."index", vc.id, vcb.ballot_id
            FROM votings_cards_ballots vcb
            INNER JOIN votings_cards vc ON vc.id = vcb.voting_card_id
            WHERE vc.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_votings_cards_ballots evcb
                WHERE evcb.id = vcb.id
                  AND evcb.election_voting_card_id = vc.idq
                  AND evcb.election_ballot_id = vcb.ballot_id
              )`,
            [electionId]
        )

        // Transfer votes -> elections_votes
        console.log("// Transfer votes -> elections_votes")
        await transactionalEntityManager.query(
            `INSERT INTO elections_votes
                (id, election_voting_card_id)
            SELECT v.id, vc.id
            FROM votes v
            INNER JOIN votings_cards vc ON vc.id = v.voting_card_id
            WHERE vc.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_votes ev
                WHERE ev.id = v.id
              )`,
            [electionId]
        )

        // Transfer votes_ballots_items -> elections_votes_ballots_items
        console.log("// Transfer votes_ballots_items -> elections_votes_ballots_items")
        await transactionalEntityManager.query(
            `INSERT INTO elections_votes_ballots_items
                (id, code, election_ballot_id, election_ballot_item_id)
            SELECT vbi.id, vbi.code, vbi.ballot_id, vbi.ballot_item_id
            FROM votes_ballots_items vbi
            INNER JOIN ballots b ON b.id = vbi.ballot_id
            WHERE b.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_votes_ballots_items evbi
                WHERE evbi.id = vbi.id
              )`,
            [electionId]
        )

        // Transfer votes_ballots_items_values -> elections_votes_ballots_items_values
        console.log("// Transfer votes_ballots_items_values -> elections_votes_ballots_items_values")
        await transactionalEntityManager.query(
            `INSERT INTO elections_votes_ballots_items_values
                (id, election_vote_ballot_item_id, voted_value, election_ballot_item_value_id, election_ballot_item_id)
            SELECT vbiv.id, vbiv.vote_ballot_item_id, vbiv.voted_value, vbiv.ballot_item_value_id, vbiv.ballot_item_id
            FROM votes_ballots_items_values vbiv
            INNER JOIN votes_ballots_items vbi ON vbi.id = vbiv.vote_ballot_item_id
            INNER JOIN ballots b ON b.id = vbi.ballot_id
            WHERE b.election_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM elections_votes_ballots_items_values evbiv
                WHERE evbiv.id = vbiv.id
              )`,
            [electionId]
        )

        if (!election.isPermanent) {
            await transactionalEntityManager.query(
                `DELETE FROM votes_ballots_items_values vbiv
                USING ballots_items bi, ballots b
                WHERE vbiv.ballot_item_id = bi.id
                  AND bi.ballot_id = b.id
                  AND b.election_id = $1`,
                [electionId]
            )

            await transactionalEntityManager.query(
                `DELETE FROM votes_ballots_items vbi
                USING ballots b
                WHERE vbi.ballot_id = b.id
                  AND b.election_id = $1`,
                [electionId]
            )

            await transactionalEntityManager.query(
                `DELETE FROM votes v
                USING votings_cards vc
                WHERE v.voting_card_id = vc.id
                  AND vc.election_id = $1`,
                [electionId]
            )

            await transactionalEntityManager.query(
                `DELETE FROM votings_cards_ballots vcb
                USING votings_cards vc
                WHERE vcb.voting_card_id = vc.id
                  AND vc.election_id = $1`,
                [electionId]
            )

            await transactionalEntityManager.query(
                `DELETE FROM votings_cards
                WHERE election_id = $1`,
                [electionId]
            )
        }
    })

    return { status: 1, message: "election_archived_successfuly" };
}

export const serviceCalculateElectionResults = async (electionId: number) => {
    // Check if the election exists
    var election = await electionRepository.findOne({
        where: { id: electionId },
        relations: { statusSchedule: { status: true } }
    })

    // Check if the election exists
    if (election == null) { return { status: 0, message: "new_election_not_found" } }
    
    // Get the number of participants and registered voters
    election.participantVoters = await votingCardRepository.count({ where: { election: { id: electionId }, statusId: 2 } })
    election.registeredVoters = await votingCardRepository.count({ where: { election: { id: electionId } } })
    await electionRepository.save(election)

    // Get all ballot items and their values and votes
    var ballotItems = await ballotItemRepository.find({
        where: { ballot: { election: { id: electionId } } },
        relations: { ballot: true, ballotItemValues: { ballotItemValueVotes: true } }
    })
    
    // Reset all ballot item values and votes
    for (var ballotItem of ballotItems) {
        ballotItem.numberOfVotes = 0
        ballotItem.numberOfParticipants = 0
        ballotItem.valuePercent = 0
        await ballotItemRepository.save(ballotItem)
        for (var ballotItemValue of ballotItem.ballotItemValues) {
            ballotItemValue.votedPosition = 0
            ballotItemValue.votedValue = 0
            ballotItemValue.voted = 0
            ballotItemValue.numberOfVotes = 0
            await ballotItemValueRepository.save(ballotItemValue)
            await ballotItemValueVoteRepository.remove(ballotItemValue.ballotItemValueVotes || [])
        }
    }

    // Calculate the number of participants and votes for each ballot item
    for (var ballotItem of ballotItems) {
        const ballotItemId = ballotItem.id

        var numberOfParticipants = await voteBallotItemRepository.count({ where: { ballotId: ballotItem.ballot.id } })
        var numberOfVotes = await voteBallotItemRepository.count({ where: { ballotItemId: ballotItemId } })

        ballotItem.numberOfParticipants = numberOfParticipants
        ballotItem.numberOfVotes = numberOfVotes
        ballotItem.valuePercent = numberOfParticipants ? Math.round((numberOfVotes / numberOfParticipants) * 100) : 0

        await ballotItemRepository.save(ballotItem)

        if (ballotItem.numberOfItemValue == 0) { continue; }

        const votesResult = await votedBallotItemValueRepository 
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

        const ballotItemValueIds = []
    
        for (var itemballotItemValue of ballotItem.ballotItemValues) {
            var votedValueIndex = 0
            
            const itemballotItemValueId = itemballotItemValue.id
            ballotItemValueIds.push(itemballotItemValueId)

            const itemVotesResult = votesResult.filter(e=> e.ballotItemValueId == itemballotItemValueId);
            const numberOfVotes = itemVotesResult.filter(e=> e.votedValue > 0).reduce((sum, current) => sum + (1 * current.count), 0);
            
            var ballotItemValue = await ballotItemValueRepository.findOneOrFail({ where: { id: itemballotItemValueId } })
            ballotItemValue.numberOfVotes = numberOfVotes;
            ballotItemValue.voted = numberOfVotes ? 1 : 0;
            ballotItemValue.votedValue = itemVotesResult.reduce((sum, current) => sum + (current.votedValue * current.count), 0);
            
            await ballotItemValueRepository.save(ballotItemValue)
            
            while(votedValueIndex < ballotItem.numberOfItemValue)
            {
                
                votedValueIndex++
                const ballotItemValueVote = new BallotItemValueVote();
                ballotItemValueVote.ballotItemValueId = itemballotItemValueId
                ballotItemValueVote.votedValue = votedValueIndex
                ballotItemValueVote.numberOfVotes = 0

                const votesResults = itemVotesResult.filter(e=> e.votedValue == votedValueIndex);
                
                if (votesResults.length == 1) {
                    ballotItemValueVote.numberOfVotes = votesResults[0].count
                }
                await ballotItemValueVoteRepository.save(ballotItemValueVote)
            }
        }
    
        var ballotItemValues = await ballotItemValueRepository.find({
                                                                        where: {ballotItem: {id: ballotItem.id}},
                                                                        order: { votedValue: "DESC" }
                                                                    })
        var votedPosition = 0;    
        var votedValue = 0;                                                           
        for( ballotItemValue of ballotItemValues )
        {
            if (ballotItemValue.voted) {
                
                if (votedPosition == 0)  votedPosition++ 
                else if (ballotItemValue.votedValue < votedValue)  votedPosition++ 
                votedValue = ballotItemValue.votedValue
                ballotItemValue.votedPosition = votedPosition
                await ballotItemValueRepository.save(ballotItemValue)
            }
        }

    }

    return { status: 1, message: "election_calculated_successfuly" };
}


export const serviceCalculateVotedValueElection = async (electionId: number) => {
    
    var ballotItems = await ballotItemRepository.find({
        where: { ballot: { election: { id: electionId } } },
        relations: { ballot: true, ballotItemValues: true }
    })

    for (var ballotItem of ballotItems) {
        const ballotItemId = ballotItem.id   
        var votedValue = 0
        var ballotItemValueIds = []
        
        for (var itemballotItemValue of ballotItem.ballotItemValues) {        
            const itemballotItemValueId = itemballotItemValue.id
            ballotItemValueIds.push(itemballotItemValueId)
        }
        
        while (votedValue < ballotItem.numberOfItemValue) {
            votedValue++
            const initialVotedValue = votedValue;
            await setBallotItemVoteValue( ballotItemId, ballotItemValueIds, initialVotedValue, votedValue, ballotItem.numberOfItemValue)
        }

    }

    return { status: 1, message: "election_votes_calculated_successfuly" };
}

const setBallotItemVoteValue = async (ballotItemId: number,  ballotItemValueIds: any[],  initialVotedValue: number, votedValue: number, numberOfItemValue: number) => {
    const result = await ballotItemValueVoteRepository
        .createQueryBuilder("item")
        .innerJoin("item.ballotItemValue", "ballotItemValue")
        .where("item.number_of_votes > 0 and ballotItemValue.voted_value = 0 and ballotItemValue.id IN (:...ballotItemValueIds) and item.voted_value <= :votedValue and ballotItemValue.ballot_item_id = :ballotItemId", { votedValue: votedValue, ballotItemId: ballotItemId, ballotItemValueIds: ballotItemValueIds })
        .select("item.ballot_item_value_id", "ballotItemValueId") // Select the ballot_item_value_id column
        .addSelect("ballotItemValue.ballot_item_id", "ballotItemId")
        .addSelect("MAX(item.voted_value)", "value")
        .addSelect("SUM(item.number_of_votes)", "votes") // Count ballot_item_value_number in each ballot_item_value_id
        .groupBy("item.ballot_item_value_id") // Group by ballot_item_value_number
        .addGroupBy("ballotItemValue.ballot_item_id")
        // .addOrderBy("value", "ASC")
        .addOrderBy("votes", "DESC")
        .getRawMany(); // Get raw result (since aggregation returns custom columns)   

    console.log("ballotItemId, initialVotedValue, votedValue, ballotItemValueIds", ballotItemId, initialVotedValue, votedValue, ballotItemValueIds)
    console.log("result", result)

    const votedResult = result.filter(e => e.votes > 0)    
    if (votedResult.length > 0) {        
        const firstValue = votedResult[0]
        const topValues = votedResult.filter(e => e.votes == firstValue.votes)

        if (topValues.length == 1) {

            console.log("topValues.length == 1", topValues)

            const itemValue = topValues[0]
            var ballotItemValue = await ballotItemValueRepository.findOneOrFail({ where: { id: itemValue.ballotItemValueId } })
            ballotItemValue.votedValue = initialVotedValue;
            await ballotItemValueRepository.save(ballotItemValue)            
            return initialVotedValue
        }
        else {
            console.log("topValues.length > 1", topValues)

            if (votedValue < numberOfItemValue) {
                const newVotedValue = votedValue + 1
                const newBallotItemValueIds = []
                for(var item of topValues ) { newBallotItemValueIds.push(item.ballotItemValueId) }
                await setBallotItemVoteValue(ballotItemId, newBallotItemValueIds, initialVotedValue, newVotedValue, numberOfItemValue)
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

