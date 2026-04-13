import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { ElectionBallot } from "./ElectionBallot"
import { ElectionBallotItemValue } from "./ElectionBallotItemValue"
import { ElectionBallotItemSubject } from "./ElectionBallotItemSubject"


@Entity('elections_ballots_items')
export class ElectionBallotItem {

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
    isItemValueReadonly: boolean

    @Column()
    numberOfItemValue: number

    @Column()
    numberOfVotes: number
    
    @Column()
    numberOfParticipants: number

    @Column()
    valuePercent: number

    @Column()
    externalId: number

    @Column()
    parentId: number

    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot   

    @OneToMany(() => ElectionBallotItemValue, (electionBallotItemValue) => electionBallotItemValue.electionBallotItem)
    electionBallotItemValues: ElectionBallotItemValue[]

    @OneToMany(() => ElectionBallotItemSubject, (electionBallotItemSubject) => electionBallotItemSubject.electionBallotItem)
    electionBallotItemSubjects: ElectionBallotItemSubject[]

    
    
}
