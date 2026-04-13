import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { ElectionBallotItemValue } from "./ElectionBallotItemValue"
import { ElectionBallotItem } from "./ElectionBallotItem"


@Entity('elections_ballots_items_subjects')
export class ElectionBallotItemSubject {

    @PrimaryColumn()
    id: number

    @Column()
    index: number

    @Column()
    code: string

    @Column()
    name: string

   
    @Column()
    imageUrl: string

    @OneToOne(() => ElectionBallotItem)
    @JoinColumn()
    electionBallotItem: ElectionBallotItem   

    
    
}
