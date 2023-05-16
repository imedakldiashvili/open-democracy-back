import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { BallotItemValue } from "../../ballots/entities/BallotItemValue"
import { VotingBallotItem } from "./VotingBallotItem"

@Entity('votings_ballots_items_values')
export class VotingBallotItemValue {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => VotingBallotItem)
    @JoinColumn()
    votingBallotItem: VotingBallotItem

    @Column()
    ballotItemValueNumber: number

    @OneToOne(() => BallotItemValue)
    @JoinColumn()
    ballotItemValue: BallotItemValue
    
}
