import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { District, PollingStation, Region } from "../../bases/entities"
import { Election } from "../entities"


@Entity('elections_pollings_stations')
export class ElectionPolingStation {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => PollingStation)
    @JoinColumn()
    pollingStation: PollingStation

    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region
        
}
