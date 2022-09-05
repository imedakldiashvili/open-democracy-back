import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { ElectionPollingStation } from "."
import { Voter } from "../../bases/entities"


@Entity('elections_votings_cards')
export class ElectionVotingCard {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ElectionPollingStation)
    @JoinColumn()
    electionPollingStation: ElectionPollingStation

    @OneToOne(() => Voter)
    @JoinColumn()
    voter: Voter

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
