import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { ElectionBallot, ElectionBallotItem, ElectionPollingStation, ElectionVotingCard } from "../entities"



@Entity('elections_votings_cards_votes')
export class ElectionVotingCardVote {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ElectionVotingCard)
    @JoinColumn()
    electionVotingCard: ElectionVotingCard

    @OneToOne(() => ElectionPollingStation)
    @JoinColumn()
    electionPollingStation: ElectionPollingStation

    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot

    @OneToOne(() => ElectionBallotItem)
    @JoinColumn()
    electionBallotItem: ElectionBallotItem

    @Column()
    isFavorite: boolean

    @Column()
    votingPoint: number
    
}
