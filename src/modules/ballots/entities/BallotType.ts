import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Ballot } from "./Ballot"

@Entity('ballots_types')
export class BallotType {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToMany(() => Ballot, (ballot) => ballot.ballotType)
    ballots: Ballot[]
    
    @Column()
    isActive: boolean
}
