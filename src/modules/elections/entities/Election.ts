import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"
import { Ballot } from "../../ballots/entities"




@Entity('elections')
export class Election {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    date: Date
    
    @Column()
    statusId: number

    @OneToMany(() => Ballot, (ballot) => ballot.election)
    ballots: Ballot[]

    
   
}
