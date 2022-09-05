import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { ElectionBallot, ElectionBallotItem, ElectionPollingStationBallot, ElectionVotingCard } from "."
import {  } from "./ElectionVotingCard"



@Entity('elections_votings_cards_votes')
export class ElectionVotingCardVote {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ElectionVotingCard)
    @JoinColumn()
    electionVotingCard: ElectionVotingCard

    @OneToOne(() => ElectionPollingStationBallot)
    @JoinColumn()
    pollingStation: ElectionPollingStationBallot

    @OneToOne(() => ElectionBallotItem)
    @JoinColumn()
    electionBallotVotedItem: ElectionBallotItem
    
}
