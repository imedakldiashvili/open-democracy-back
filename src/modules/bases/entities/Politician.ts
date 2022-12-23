import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { District } from "./District"


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
    
    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @Column()
    isActive: boolean

}
