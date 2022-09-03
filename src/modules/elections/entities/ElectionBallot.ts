import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { BallotType } from "../../bases/entities"
import { Election, ElectionBallotItem } from "../entities"


@Entity('elections_ballots')
export class ElectionBallot {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => BallotType)
    @JoinColumn()
    ballotType: BallotType

    @Column()
    code: string

    @Column()
    name: string

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToMany(() => ElectionBallotItem, (electionBallotItem) => electionBallotItem.electionBallot)
    @JoinColumn()
    electionBallotItems: ElectionBallotItem[]
    
}
