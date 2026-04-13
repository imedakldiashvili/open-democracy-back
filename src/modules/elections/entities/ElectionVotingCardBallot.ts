import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { ElectionBallot } from "./ElectionBallot"
import { ElectionVotingCard } from "./ElectionVotingCard"



@Entity('elections_voting_cards_ballots')
export class ElectionVotingCardBallot {

    @PrimaryColumn()
    id: number

    @Column()
    index: number
    
    @Column()
    electionVotingCardId: number
    
    @OneToOne(() => ElectionVotingCard)
    @JoinColumn()
    electionVotingCard: ElectionVotingCard

    @Column()
    electionBallotId: number

    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot


    
}
