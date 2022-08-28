import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('base_regions')
export class Region {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string
    
}
