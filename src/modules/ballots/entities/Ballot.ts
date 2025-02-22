import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Election } from "../../elections/entities"
import { District } from "../../locations/entities"
import { BallotItem } from "./BallotItem"
import { BallotType } from "./BallotType"

@Entity('ballots')
export class Ballot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    index: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    districtId: number

    @OneToOne(() => District)
    @JoinColumn()
    district: District
    
    @Column()
    electionId: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election
    
    @Column()
    ballotTypeId: number

    @OneToOne(() => BallotType)
    @JoinColumn()
    ballotType: BallotType

    @OneToMany(() => BallotItem, (ballotItem) => ballotItem.ballot)
    ballotItems: BallotItem[]


}
