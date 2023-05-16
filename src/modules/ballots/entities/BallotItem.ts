import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Ballot } from "./Ballot"
import { BallotItemValue } from "./BallotItemValue"


@Entity('ballots_items')
export class BallotItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    hasItemValue: boolean
        
    @Column()
    numberOfItemValue: number

    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot   

    @OneToMany(() => BallotItemValue, (ballotItemValue) => ballotItemValue.ballotItem)
    ballotItemValues: BallotItemValue[]
    
    
}
