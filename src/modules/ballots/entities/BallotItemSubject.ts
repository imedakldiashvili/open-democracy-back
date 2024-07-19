import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { BallotItemValue } from "./BallotItemValue"
import { BallotItem } from "./BallotItem"


@Entity('ballots_items_subjects')
export class BallotItemSubject {

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

  

    @OneToOne(() => BallotItem)
    @JoinColumn()
    ballotItem: BallotItem   

    
    
}
