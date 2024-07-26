import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Ballot, BallotItem } from "../../ballots/entities"
import { VoteBallotItemValue } from "./VoteBallotItemValue"

@Entity('votes_ballots_items')
export class VoteBallotItem {

    @PrimaryGeneratedColumn("uuid")
    id: string

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

}
