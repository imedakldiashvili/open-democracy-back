import { Entity, Column, PrimaryColumn } from "typeorm"
import { Ballot, BallotItem } from "../../ballots/entities"
import { VoteBallotItemValue } from "./VoteBallotItemValue"

@Entity('voted_cards')
export class VoteBallotItem {

    @PrimaryColumn()
    id: number

    @Column()
    code: string

}
