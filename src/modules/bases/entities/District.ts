import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { PollingStation } from "./PollingStation"
import { Region } from "./Region"

@Entity('base_districts')
export class District {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    regionId: number

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region

    @OneToMany(() => PollingStation, (pollingStation) => pollingStation.district)
    pollingStations: PollingStation[]
    
}
