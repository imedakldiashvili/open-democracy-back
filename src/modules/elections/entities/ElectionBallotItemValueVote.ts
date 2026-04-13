import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { ElectionBallotItemValue } from "./ElectionBallotItemValue"

@Entity('elections_ballots_items_values_votes')
export class ElectionBallotItemValueVote {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    votedValue: number

    @Column()
    numberOfVotes: number

    @Column()
    ballotItemValueId: number

    @OneToOne(() => ElectionBallotItemValue)
    @JoinColumn()
    electionBallotItemValue: ElectionBallotItemValue   
    
    @Column()
    parentId: number
}
