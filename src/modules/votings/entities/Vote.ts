import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Ballot, BallotItem } from "../../ballots/entities"
import { VoteBallotItemValue } from "./VoteBallotItemValue"

@Entity('votes')
export class Vote{

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    votingCardId: number

}
