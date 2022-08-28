import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('base_elections')
export class Election {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    date: Date
    
}
