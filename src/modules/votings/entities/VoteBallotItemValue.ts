import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { BallotItemValue } from "../../ballots/entities/BallotItemValue"
import { BallotItem } from "../../ballots/entities"

@Entity('votes_ballots_items_values')
export class VoteBallotItemValue {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    voteBallotItemId: string

    @Column()
    votedValue: number

    @Column()
    ballotItemValueId: number 

    @Column()
    ballotItemId: number 

    @OneToOne(() => BallotItem)
    @JoinColumn()
    ballotItem: BallotItem

    @OneToOne(() => BallotItemValue)
    @JoinColumn()
    ballotItemValue: BallotItemValue


}
