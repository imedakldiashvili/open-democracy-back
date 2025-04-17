import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { BallotItemValue } from "./BallotItemValue"

@Entity('ballots_items_values_votes')
export class BallotItemValueVote {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    votedValue: number

    @Column()
    numberOfVotes: number

    @Column()
    ballotItemValueId: number

    @OneToOne(() => BallotItemValue)
    @JoinColumn()
    ballotItemValue: BallotItemValue   
    
    
}
