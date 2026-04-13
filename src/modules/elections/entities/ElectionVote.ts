import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity('elections_votes')
export class ElectionVote{

    @PrimaryColumn("uuid")
    id: string

    @Column()
    electionVotingCardId: number

}
