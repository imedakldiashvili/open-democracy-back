import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { TemplateBallot } from "./TemplateBallot"
import { TemplateBallotItemValue } from "./TemplateBallotItemValue"





@Entity('templates_ballots_items')
export class TemplateBallotItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    templateBallotId: number
    
    @Column()
    index: number
    
    @Column()
    number: number
    
    @Column()
    code: string

    @Column()
    name: string

    @Column()
    title: string

    @Column()
    imageUrl: string


    @OneToOne(() => TemplateBallot)
    @JoinColumn()
    templateBallot: TemplateBallot


    @Column()
    hasItemValue: boolean

    @Column()
    numberOfItemValue: number

    @OneToMany(() => TemplateBallotItemValue, (templateBallotItemValue) => templateBallotItemValue.templateBallotItem)
    templateBallotItemValues: TemplateBallotItemValue[] 

}
