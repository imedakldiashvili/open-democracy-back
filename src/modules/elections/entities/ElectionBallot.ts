import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Ballot, BallotType } from "../../bases/entities"
import { Election, ElectionBallotItem } from "../entities"


@Entity('elections_ballots')
export class ElectionBallot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToMany(() => ElectionBallotItem, (electionBallotItem) => electionBallotItem.electionBallot)
    @JoinColumn()
    electionBallotItems: ElectionBallotItem[]
    
}
