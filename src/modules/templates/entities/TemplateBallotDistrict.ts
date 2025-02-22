import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"

import { TemplateBallot } from "./TemplateBallot"
import { District } from "../../locations/entities"





@Entity('templates_ballots_districts')
export class TemplateBallotDistrict {
    @PrimaryGeneratedColumn()
    id: number

    templateBallotId: number

    @OneToOne(() => TemplateBallot)
    @JoinColumn()
    templateBallot: TemplateBallot

    @Column()
    districtId: number
    
    @OneToOne(() => District)
    @JoinColumn()
    district: District
   
}
