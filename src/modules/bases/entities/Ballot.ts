import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Election } from "../../elections/entities"
import { BallotItem } from "./BallotItem"
import { BallotType } from "./BallotType"

@Entity('ballots')
export class Ballot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => BallotType)
    @JoinColumn()
    ballotType: BallotType
    
    @OneToMany(() => BallotItem, (ballotItem) => ballotItem.ballot)
    ballotItem: BallotItem[]

    @Column()
    hasDetail: boolean

}
