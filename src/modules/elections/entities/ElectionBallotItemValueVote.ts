import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { ElectionBallotItemValue } from "./ElectionBallotItemValue"

@Entity('elections_ballots_items_values_votes')
export class ElectionBallotItemValueVote {

    @PrimaryColumn()
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
    
}
