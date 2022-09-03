import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Region } from "../../bases/entities"
import { Election, ElectionBallot } from "."


@Entity('elections_votingd_cards')
export class ElectionVotingCard {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region

}
