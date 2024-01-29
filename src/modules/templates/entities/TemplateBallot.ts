import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { Template } from "./Template"
import { BallotType } from "../../ballots/entities"
import { TemplateBallotItem } from "./TemplateBallotItem"





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

    @Column()
    isLocal: boolean

        
    @Column()
    isDelegateGroup: Boolean
    
    @Column()
    districtId: number

    @OneToMany(() => TemplateBallotItem, (templateBallotItem) => templateBallotItem.templateBallot)
    templateBallotItems: TemplateBallotItem[] 
   
}
