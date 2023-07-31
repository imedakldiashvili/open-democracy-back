import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"

@Entity('users_inivitations')
export class UserInivitation {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    senderUserId: number

    @Column()
    personalId: string

    @Column()
    mobile: string

    @Column()
    fullName: string

    @Column()
    expireOn: Date

    @Column()
    statusId: number

    @Column()
    createdUserId: number

}

