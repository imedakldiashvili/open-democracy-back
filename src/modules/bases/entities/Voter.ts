import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { PollingStation } from "./PollingStation"

@Entity('base_voters')
export class Voter {

    @PrimaryGeneratedColumn()
    id: number

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

    @OneToOne(() => PollingStation)
    @JoinColumn()
    pollingStation: PollingStation


    @Column()
    isActive: boolean
    
}
