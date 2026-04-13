import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { ElectionBallot } from "./ElectionBallot"
import { ElectionVoteCard } from "./ElectionVotingCard"



@Entity('elections_votes_cards_ballots')
export class ElectionVoteCardBallot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    index: number
    
    @Column()
    electionVoteCardId: number
    
    @OneToOne(() => ElectionVoteCard)
    @JoinColumn()
    electionVoteCard: ElectionVoteCard

    @Column()
    electionBallotId: number

    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot


    
}
