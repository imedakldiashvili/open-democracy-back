import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"



@Entity('elections')
export class Election {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    date: Date
    
    @Column()
    statusId: number
    
}
