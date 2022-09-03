import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { District } from "./District"
import { Organization } from "./Organization"

@Entity('base_politicians')
export class Politician {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    title: string
    
    @OneToOne(() => Organization)
    @JoinColumn()
    organization: Organization

    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @Column()
    isActive: boolean

}
