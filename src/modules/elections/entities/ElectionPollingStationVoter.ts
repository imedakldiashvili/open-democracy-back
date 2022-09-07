import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Election, ElectionPollingStation } from "../entities"


@Entity('elections_pollings_stations_voters')
export class ElectionPollingStationVoter {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ElectionPollingStation)
    @JoinColumn()
    electionPollingStation: ElectionPollingStation
    
    @Column()
    voterId: number

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
