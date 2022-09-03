import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Region } from "../../bases/entities"
import { Election, ElectionBallot } from "."


@Entity('elections_votings_cards_ballots')
export class ElectionVotingCardBallot {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region

}
