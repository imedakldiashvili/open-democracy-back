import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { Election } from "./Election"
import { ElectionStatus } from "./ElectionStatus"




@Entity('elections_stages')
export class ElectionStage{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string   
    
    @Column()
    name: string   

    @Column()
    isActual: boolean   

    @OneToMany(() => ElectionStatus, (status) => status.stage)
    statuses: ElectionStatus[]    
   
}
