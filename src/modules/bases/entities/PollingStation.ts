import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Ballot } from "./Ballot"
import { BallotPollingStation } from "./BallotPollingStation"
import { District } from "./District"

@Entity('base_pollings_stations')
export class PollingStation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToOne(() => District)
    @JoinColumn()
    district: District
    
    @OneToMany(() => BallotPollingStation, (ballotPollingStation) => ballotPollingStation.pollingStation)
    ballotPollingStations: BallotPollingStation[]

    @Column()
    isActive: boolean

}
