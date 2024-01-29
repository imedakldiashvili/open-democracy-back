import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Ballot } from "./Ballot"
import { BallotItemValue } from "./BallotItemValue"


@Entity('ballots_items')
export class BallotItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    index: number

    @Column()
    code: string

    @Column()
    name: string

    
    @Column()
    imageUrl: string

    @Column()
    hasItemValue: boolean
        
    @Column()
    numberOfItemValue: number

    @Column()
    numberOfVotes: number
    
    @Column()
    numberOfParticipants: number

    @Column()
    valuePercent: number

    @OneToOne(() => Ballot)
    @JoinColumn()
    ballot: Ballot   

    @OneToMany(() => BallotItemValue, (ballotItemValue) => ballotItemValue.ballotItem)
    ballotItemValues: BallotItemValue[]
    
    
}
