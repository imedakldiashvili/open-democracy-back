import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Ballot, BallotItem } from "../../ballots/entities"
import { VotingBallotItemValue } from "./VotingBallotItemValue"

@Entity('votings_ballots_items')
export class VotingBallotItem {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot

    @OneToOne(() => BallotItem)
    @JoinColumn()
    ballotItem: BallotItem

    @OneToMany(() => VotingBallotItemValue, (votingBallotItemValue) => votingBallotItemValue.votingBallotItem)
    votingBallotItemValues: VotingBallotItemValue[]
    
    @Column()
    voterCode: string
}
