import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { BallotItemValue } from "../../ballots/entities/BallotItemValue"
import { VoteBallotItem } from "./VoteBallotItem"

@Entity('votes_ballots_items_values')
export class VoteBallotItemValue {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    voteBallotItemId: string

    @Column()
    ballotItemValueNumber: number

    @Column()
    ballotItemValueId: number 


    @OneToOne(() => BallotItemValue)
    @JoinColumn()
    ballotItemValue: BallotItemValue


}
