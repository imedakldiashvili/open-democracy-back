import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('base_pollings_stations')
export class PollingStation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    districtId: number
    
}
