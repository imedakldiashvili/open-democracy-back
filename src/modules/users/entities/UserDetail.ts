import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { District } from "../../locations/entities"

@Entity('users_details')
export class UserDetail {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

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
