import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { VotingCard } from "./VotingCard"



@Entity('votings_cards_ballots')
export class VotingCardBallot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    votingCardId: number
    
    @OneToOne(() => VotingCard)
    @JoinColumn()
    votingCard: VotingCard

    @Column()
    ballotId: number

    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot

    @Column()
    index: number
    
}
