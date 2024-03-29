import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { BallotItemValue } from "../../ballots/entities/BallotItemValue"
import { VoteBallotItem } from "./VoteBallotItem"

@Entity('votes_ballots_items_values')
export class VoteBallotItemValue {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => VoteBallotItem)
    @JoinColumn()
    voteBallotItem: VoteBallotItem

    @Column()
    ballotItemValueNumber: number

    @OneToOne(() => BallotItemValue)
    @JoinColumn()
    ballotItemValue: BallotItemValue
    
}
