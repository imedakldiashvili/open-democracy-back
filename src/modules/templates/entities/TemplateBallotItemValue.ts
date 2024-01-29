import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { Template } from "./Template"
import { BallotType } from "../../ballots/entities"
import { TemplateBallotItem } from "./TemplateBallotItem"





@Entity('templates_ballots_items_values')
export class TemplateBallotItemValue {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    templateBallotItemd: number
    
    @Column()
    index: number
    
    @Column()
    code: string

    @Column()
    name: string

    @Column()
    title: string

    @Column()
    imageUrl: string

    @Column()
    hasItemValue: boolean

    @OneToOne(() => TemplateBallotItem)
    @JoinColumn()
    templateBallotItem: TemplateBallotItem


}
