import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { ElectionBallotItemValue } from "./ElectionBallotItemValue"
import { ElectionBallotItem } from "./ElectionBallotItem"


@Entity('elections_ballots_items_subjects')
export class ElectionBallotItemSubject {

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
    parentId: number

    @OneToOne(() => ElectionBallotItem)
    @JoinColumn()
    electionBallotItem: ElectionBallotItem   

    
    
}
