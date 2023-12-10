import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { Election } from "./Election"




@Entity('elections_status')
export class ElectionStatus {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string   

    @OneToMany(() => Election, (election) => election.status)
    elections: Election[]    
   
}
