import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Ballot, BallotItem } from "../../ballots/entities"
import { VoteBallotItemValue } from "./VoteBallotItemValue"

@Entity('voted_ballots_items')
export class VoteBallotItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    ballotId: number
    
    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot

    @Column()
    ballotItemId: number

    @OneToOne(() => BallotItem)
    @JoinColumn()
    ballotItem: BallotItem

    @OneToMany(() => VoteBallotItemValue, (voteBallotItemValue) => voteBallotItemValue.voteBallotItem)
    VoteBallotItemValues: VoteBallotItemValue[]
}
