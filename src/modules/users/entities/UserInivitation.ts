import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"

@Entity('users_inivitations')
export class UserInivitation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    personalId: string

    @Column()
    mobile: string

    @Column()
    email: string

    @Column()
    expireOn: Date

    @Column()
    statusId: number

    @Column()
    createdUserId: number

}

