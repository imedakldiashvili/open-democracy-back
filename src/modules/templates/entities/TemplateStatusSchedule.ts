import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { Template } from "./Template"
import { ElectionStatus } from "../../elections/entities"




@Entity('templates_statuses_schedules')
export class TemplateStatusSchedule {

    @PrimaryGeneratedColumn()
    id: number


    @OneToOne(() => Template)
    @JoinColumn()
    template: Template

    @OneToOne(() => ElectionStatus)
    @JoinColumn()
    status: ElectionStatus

    @Column()
    state: number  

    @Column()
    hasValueMin: boolean

    @Column()
    valueMinFrom: number
    
    @Column()
    valueMinTo: number
   
}
