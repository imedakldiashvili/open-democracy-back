import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('base_voters')
export class Voter {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    birthDate: Date

    @Column()
    pollingStationId: number

    @Column()
    date: Date
    
}
