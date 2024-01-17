import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Ballot } from "./Ballot"
import { TemplateBallot } from "../../templates/entities/TemplateBallot"

@Entity('ballots_types')
export class BallotType {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToMany(() => Ballot, (ballot) => ballot.ballotType)
    ballots: Ballot[]
    
    @OneToMany(() => TemplateBallot, (templateBallot) => templateBallot.ballotType)
    templateBallots: TemplateBallot[]
    

    @Column()
    byDelegateGroup: boolean    

    @Column()
    isActive: boolean
}
