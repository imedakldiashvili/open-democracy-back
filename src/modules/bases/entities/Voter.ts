import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { PollingStation } from "./PollingStation"

@Entity('clients')
export class Voter {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    valueDate: Date

    @Column()
    client_code: string

    @Column()
    firstName: string

    @Column()
    lastName: string


    @Column()
    isActive: boolean
    
}
