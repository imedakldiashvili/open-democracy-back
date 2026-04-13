import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { ElectionBallot } from "./ElectionBallot"
import { ElectionBallotItem } from "./ElectionBallotItem"

@Entity('elections_votes_ballots_items')
export class ElectionVoteBallotItem {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    code: string

    @Column()
    ballotId: number
    
    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot

    @Column()
    ballotItemId: number

    @OneToOne(() => ElectionBallotItem)
    @JoinColumn()
    electionBallotItem: ElectionBallotItem

}
