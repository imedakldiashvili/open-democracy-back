import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { District } from "../../locations/entities"
import { User } from "./User"

@Entity('users_details')
export class UserDetail {

    @PrimaryColumn()
    id: number

    @Column()
    code: string

    @Column()
    fullName: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    isActive: boolean    
    
    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @OneToOne(() => User)
    @JoinColumn({name: "id"} )
    user: User

    @Column()
    isDelegate: boolean
    
}
