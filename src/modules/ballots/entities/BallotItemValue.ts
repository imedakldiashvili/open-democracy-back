import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { BallotItem } from "./BallotItem"

@Entity('ballots_items_values')
export class BallotItemValue {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    index: number

    @Column()
    code: string

    @Column()
    title: string

    @Column()
    name: string

    @Column()
    imageUrl: string

    
    @Column()
    votedValue: number

    @OneToOne(() => BallotItem)
    @JoinColumn()
    ballotItem: BallotItem   
    
    
}
