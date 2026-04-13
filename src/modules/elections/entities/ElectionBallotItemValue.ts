import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { ElectionBallotItem } from "./ElectionBallotItem"
import { ElectionBallotItemValueVote } from "./ElectionBallotItemValueVote"

@Entity('elections_ballots_items_values')
export class ElectionBallotItemValue {

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
    externalId: number

    @Column()
    numberOfVotes: number

    @Column()
    parentId: number

    @OneToOne(() => ElectionBallotItem)
    @JoinColumn()
    electionBallotItem: ElectionBallotItem   


    @OneToMany(() => ElectionBallotItemValueVote, (electionBallotItemValueVote) => electionBallotItemValueVote.electionBallotItemValue)
    electionBallotItemValueVotes: ElectionBallotItemValueVote[]
    
    
}
