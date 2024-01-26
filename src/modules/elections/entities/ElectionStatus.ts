import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { Election } from "./Election"
import { ElectionStage } from "./ElectionStage"
import { TemplateStatusSchedule } from "../../templates/entities/TemplateStatusSchedule"




@Entity('elections_statuses')
export class ElectionStatus {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string   

    @Column()
    name: string   

    @Column()
    stageId: number  

    @Column()
    isActual: boolean

    @OneToOne(() => ElectionStage)
    @JoinColumn()
    stage: ElectionStage 

    @Column()
    stageProgress: number    

    @Column()
    jobProcessingFlag: boolean

    @OneToMany(() => TemplateStatusSchedule, (statusSchedule) => statusSchedule.status)
    statusSchedule: TemplateStatusSchedule[]

}
