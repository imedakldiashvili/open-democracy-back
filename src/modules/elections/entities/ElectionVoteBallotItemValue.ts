import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { ElectionBallotItem } from "./ElectionBallotItem"
import { ElectionBallotItemValue } from "./ElectionBallotItemValue"

@Entity('elections_votes_ballots_items_values')
export class ElectionVoteBallotItemValue {

    @PrimaryColumn("uuid")
    id: string

    @Column()
    electionVoteBallotItemId: string

    @Column()
    votedValue: number

    @Column()
    electionBallotItemValueId: number 

    @Column()
    electionBallotItemId: number 

    @OneToOne(() => ElectionBallotItem)
    @JoinColumn()
    electionBallotItem: ElectionBallotItem

    @OneToOne(() => ElectionBallotItemValue)
    @JoinColumn()
    electionBallotItemValue: ElectionBallotItemValue


}
