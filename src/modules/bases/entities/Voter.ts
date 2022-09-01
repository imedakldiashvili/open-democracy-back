import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { PollingStation } from "./PollingStation"

@Entity('base_voters')
export class Voter {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    fathersName: string

    @Column()
    birthDate: Date

    @Column()
    pollingStationId: number
    
    @OneToOne(() => PollingStation)
    @JoinColumn()
    pollingStation: PollingStation

    @Column()
    valueDate: Date
    
}
