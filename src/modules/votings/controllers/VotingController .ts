import { NextFunction, Request, Response } from 'express'

import { ballotRepository } from '../../ballots/repositories';
import { electionRepository } from '../../elections/repositories';
import { ballotBoxRepository, } from '../repositories';
import { generateHash } from '../../../middlewares/security'
import { newGuid } from '../../../utils'
import { VotingCard } from '../entities';
import { userDetailRepository } from '../../users/repositories';


class VotingControll {

    static getNewVotingCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { electionId, voterId } = req.body;

            const election = await electionRepository.findOneOrFail({
                where: { id: electionId, actualStatusSchedule: {status: { id: 2 }}  }
            });

            const electionBallots = await ballotRepository.find({
                where: { election: { id: electionId }, districts: { userDetails: { id: voterId } } },
                relations: { ballotType: true, ballotItems: { ballotItemValues: true } },
                order: { index: "ASC", ballotItems: { code: "ASC" } }
            });

            const voter = await userDetailRepository.findOneOrFail({
                relations: { district: { region: true } },
                where: { id: voterId }
            })

            const ballotBox = await ballotBoxRepository.findOne({
                where: { election: { id: electionId } },
                order: { id: -1 }
            })
            var ballotBoxRequestPrivateKey = ballotBox.requestPrivateKey;

            var uid = newGuid().toString()
            var ballotBoxId = ballotBox.id.toString()
            var votingCardSalt = ballotBoxId + ballotBoxRequestPrivateKey;

            const votingCard = {
                uid: uid, 
                hash:  generateHash(uid, votingCardSalt),
                voter: {
                    id: voter.id,
                    code: voter.code,
                    firstName: voter.firstName,
                    lastName: voter.lastName,
                    district: { id: voter.district.id, code: voter.district.code, name: voter.district.name },
                    region: { id: voter.district.region.id, code: voter.district.region.code, name: voter.district.region.name },
                },
                election: { id: election.id, code: election.code, name: election.name },
                ballots: []
            }

 

            for (var ballot of electionBallots) {

                var voteBallot = { 
                    id: ballot.id, 
                    ballotType: {id: ballot.ballotType.id, code: ballot.ballotType.code,  name: ballot.ballotType.name },
                    ballotCode: ballot.code, 
                    ballotName: ballot.name, 
                    ballotItems: [] 
                }

                for (var ballotItem of ballot.ballotItems) {
                    var ballotItemId = ballotItem.id.toString()
                    var ballotItemSalt = uid + ballotBoxRequestPrivateKey;

                    var voteBallotItem = {
                        id: ballotItem.id,
                        // hash: generateHash(ballotItemId, ballotItemSalt),
                        code: ballotItem.code,
                        name: ballotItem.name,                        
                        itemValues: []
                    }

                    for (var ballotItemValue of ballotItem.ballotItemValues)
                    {
                        var ballotItemValueId = ballotItemValue.id.toString()
                        var ballotItemValueSalt = uid + ballotBoxRequestPrivateKey;
                        var voteBallotItemValue = {
                            id: ballotItemValue.id,
                            // hash: generateHash(ballotItemValueId, ballotItemValueSalt),
                            code: ballotItemValue.code,
                            name: ballotItemValue.name,                            
                        }

                        voteBallotItem.itemValues.push(voteBallotItemValue)
    
                    }


                    voteBallot.ballotItems.push(voteBallotItem)
                }

                votingCard.ballots.push(voteBallot)

            }

            return res.json(votingCard);
        } catch (error) {
            next(error)
        }
    };

    
}



export default VotingControll;