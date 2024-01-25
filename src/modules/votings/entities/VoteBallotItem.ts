import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Ballot, BallotItem } from "../../ballots/entities"
import { VoteBallotItemValue } from "./VoteBallotItemValue"

@Entity('votes_ballots_items')
export class VoteBallotItem {

    @PrimaryGeneratedColumn()
    id: number

    @PrimaryGeneratedColumn()
    code: string

    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot

    @OneToOne(() => BallotItem)
    @JoinColumn()
    ballotItem: BallotItem

    @OneToMany(() => VoteBallotItemValue, (voteBallotItemValue) => voteBallotItemValue.voteBallotItem)
    VoteBallotItemValues: VoteBallotItemValue[]
}
