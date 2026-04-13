import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { District } from "../../locations/entities"
import { BallotType } from "../../ballots/entities"
import { Election } from "."
import { ElectionBallotItem } from "./ElectionBallotItem"


@Entity('ballots')
export class ElectionBallot {

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

    @Column()
    parentId: number

    @OneToOne(() => BallotType)
    @JoinColumn()
    ballotType: BallotType

    @OneToMany(() => ElectionBallotItem, (electionBallotItem) => electionBallotItem.electionBallot)
    electionBallotItems: ElectionBallotItem[]


}
