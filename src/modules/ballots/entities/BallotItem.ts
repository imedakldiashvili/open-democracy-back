import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Ballot } from "./Ballot"
import { BallotType } from "./BallotType"

@Entity('base_ballots_items')
export class BallotItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot   
    
    
}
