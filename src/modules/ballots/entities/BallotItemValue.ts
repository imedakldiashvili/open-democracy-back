import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { BallotItem } from "./BallotItem"
import { BallotItemValueVote } from "./BallotItemValueVote"

@Entity('ballots_items_values')
export class BallotItemValue {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    index: number

    @Column()
    code: string

    @Column()
    title: string

    @Column()
    name: string

    @Column()
    imageUrl: string

    
    @Column()
    votedValue: number

    @Column()
    votedPosition: number

    @Column()
    voted: number

    @Column()
    numberOfVotes: number

    @OneToOne(() => BallotItem)
    @JoinColumn()
    ballotItem: BallotItem   


    @OneToMany(() => BallotItemValueVote, (ballotItemValueVote) => ballotItemValueVote.ballotItemValue)
    ballotItemValueVote: BallotItemValueVote[]
    
    
}
