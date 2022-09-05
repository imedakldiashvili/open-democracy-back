import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Voter } from "../../bases/entities"
import { ElectionPollingStation, ElectionVotingCard } from "../entities"


@Entity('elections_voters')
export class ElectionVoter 
{
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Voter)
    @JoinColumn()
    voter: Voter

    @OneToOne(() => ElectionPollingStation)
    @JoinColumn()
    electionPollingStation: ElectionPollingStation

    @OneToOne(() => ElectionVotingCard)
    @JoinColumn()
    electionVotingCard: ElectionVotingCard

    @Column()
    valueDate: Date

    @Column()
    code: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    birthDate: Date
        
}
