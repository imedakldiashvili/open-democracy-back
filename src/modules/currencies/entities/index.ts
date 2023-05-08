import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"



@Entity('currencies')
export class Currency {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string
    
}
