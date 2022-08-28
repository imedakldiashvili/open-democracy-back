import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('base_districts')
export class District {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    regionId: number
    
}
