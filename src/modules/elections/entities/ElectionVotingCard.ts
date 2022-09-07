import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { ElectionPollingStation } from "./ElectionPollingStation"
import { ElectionPollingStationVoter } from "./ElectionPollingStationVoter"
import { ElectionVotingCardVote } from "./ElectionVotingCardVote"


@Entity('elections_votings_cards')
export class ElectionVotingCard {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ElectionPollingStationVoter)
    @JoinColumn()
    electionPollingStationVoter: ElectionPollingStationVoter
    
    @OneToOne(() => ElectionPollingStation)
    @JoinColumn()
    electionPollingStation: ElectionPollingStation

    @OneToMany(() => ElectionVotingCardVote, (electionVotingCardVote) => electionVotingCardVote.electionVotingCard)
    @JoinColumn()
    electionVotingCardVotes: ElectionVotingCardVote[]

    @Column()
    createdAt: Date 

    @Column()
    expiredAt: Date 

    @Column()
    voted: number
    
    @Column()
    votedAt: Date 




}
