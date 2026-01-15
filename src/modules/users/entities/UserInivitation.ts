import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"

@Entity('users_inivitations')
export class UserInivitation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    mobileNumber: string

    @Column()
    personalId: string

    @Column()
    email: string

    @Column()
    expireOn: Date

    @Column()
    statusId: number

    @Column()
    createdUserId: number

}

