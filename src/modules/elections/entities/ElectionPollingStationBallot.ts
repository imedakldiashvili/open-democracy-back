import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { ElectionBallot, ElectionPollingStation } from "."


@Entity('elections_pollings_stations_ballots')
export class ElectionPollingStationBallot {

    @PrimaryGeneratedColumn()
    id: number
   
    @OneToOne(() => ElectionPollingStation)
    @JoinColumn()
    electionPollingStation: ElectionPollingStation

    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot

    
}
