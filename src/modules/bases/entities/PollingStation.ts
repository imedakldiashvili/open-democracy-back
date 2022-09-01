import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
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
    
}
