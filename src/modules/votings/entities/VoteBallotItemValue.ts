import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { BallotItemValue } from "../../ballots/entities/BallotItemValue"
import { VoteBallotItem } from "./VoteBallotItem"

@Entity('voted_ballots_items_values')
export class VoteBallotItemValue {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    voteBallotItemId: string

    @Column()
    ballotItemValueNumber: number

    @OneToOne(() => BallotItemValue)
    @JoinColumn()
    ballotItemValue: BallotItemValue
    
}
