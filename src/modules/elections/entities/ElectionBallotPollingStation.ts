import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { District, Region } from "../../bases/entities"
import { Election, ElectionBallot } from "../entities"

@Entity('elections_ballots_pollins_stations')
export class ElectionBallotPollingStation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    date: Date

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot

    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region
    
}
