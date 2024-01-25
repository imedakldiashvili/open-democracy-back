import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { Election } from "./Election"
import { ElectionStatus } from "./ElectionStatus"




@Entity('elections_statuses_schedules')
export class ElectionStatusSchedule {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    hasValueDate: boolean 

    @Column()
    valueDateFrom: Date

    @Column()
    valueDateTo: Date

    @Column()
    numberOfVoters: number  

    @Column()
    numberOfParticipantsVoters: number   
     
    @Column()
    state: number   


    @OneToOne(() => ElectionStatus)
    @JoinColumn()
    status: ElectionStatus

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToMany(() => Election, (actualElection) => actualElection.actualStatusSchedule)
    actualElection: Election[] 
   
}
