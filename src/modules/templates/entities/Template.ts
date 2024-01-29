import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { TemplateBallot } from "./TemplateBallot"
import { TemplateStatusSchedule } from "./TemplateStatusSchedule"





@Entity('templates')
export class Template {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    isActive: Boolean

    @OneToMany(() => TemplateBallot, (templateBallots) => templateBallots.template)
    templateBallots: TemplateBallot[]   
    
    @OneToMany(() => TemplateStatusSchedule, (statusSchedule) => statusSchedule.template)
    statusSchedule: TemplateStatusSchedule[] 

    

}
