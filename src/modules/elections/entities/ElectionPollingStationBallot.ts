import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { District, Region } from "../../bases/entities"
import { Election, ElectionBallot, ElectionPollingStation } from "../entities"

@Entity('elections_pollings_stations_ballots')
export class ElectionPollingStationBallot {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot

    @OneToOne(() => ElectionPollingStation)
    @JoinColumn()
    electionPollingStation: ElectionPollingStation
    
}
