import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { Template } from "./Template"
import { BallotType } from "../../ballots/entities"
import { TemplateBallotItem } from "./TemplateBallotItem"
import { TemplateBallotDistrict } from "./TemplateBallotDistrict"





@Entity('templates_ballots')
export class TemplateBallot {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    index: number

    @Column()
    templateId: number

    @OneToOne(() => Template)
    @JoinColumn()
    template: Template

    @Column()
    ballotTypeId: number
    
    @OneToOne(() => BallotType)
    @JoinColumn()
    ballotType: BallotType


    @OneToMany(() => TemplateBallotItem, (templateBallotItem) => templateBallotItem.templateBallot)
    templateBallotItems: TemplateBallotItem[] 

    @OneToMany(() => TemplateBallotDistrict, (templateBallotDistrict) => templateBallotDistrict.templateBallot)
    templateBallotDistricts: TemplateBallotDistrict[] 


    
   
}
