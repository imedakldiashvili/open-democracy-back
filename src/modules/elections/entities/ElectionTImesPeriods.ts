import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { Election } from "./Election"




@Entity('elections_times_periods')
export class ElectionTimePeriod {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string   
    
    @Column()
    valueDate: Date

    @Column()
    numberOfVoters: number  
     
    @Column()
    state: number   

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election
   
}
