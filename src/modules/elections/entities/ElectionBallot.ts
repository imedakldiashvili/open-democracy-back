import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Election } from "./Election"
import { ElectionBallotItem } from "./ElectionBallotItem"

@Entity('elections_ballots')
export class ElectionBallot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    electionId: number

    @Column()
    ballotTypeId: number


    @Column()
    code: string

    @Column()
    name: string

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToMany(() => ElectionBallotItem, (electionBallotItem) => electionBallotItem.electionBallot)
    @JoinColumn()
    electionBallotItems: ElectionBallotItem[]
    
}
