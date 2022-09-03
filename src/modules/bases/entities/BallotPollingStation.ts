import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Ballot, PollingStation } from "../entities"

@Entity('base_ballots_pollings_stations')
export class BallotPollingStation {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot
    
    @OneToOne(() => PollingStation)
    @JoinColumn()
    pollingStation: PollingStation
    
    
}
