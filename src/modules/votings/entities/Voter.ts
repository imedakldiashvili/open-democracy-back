import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { District } from "../../locations/entities"

@Entity('voters')
export class Voter {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    voterCode: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    isActive: boolean    
    
    @OneToOne(() => District)
    @JoinColumn()
    district: District
    
}
