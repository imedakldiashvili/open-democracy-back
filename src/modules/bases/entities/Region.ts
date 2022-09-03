import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"
import { District } from "./District"

@Entity('base_regions')
export class Region {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToMany(() => District, (district) => district.region)
    districts: District[]

    @Column()
    isActive: boolean
    
}
