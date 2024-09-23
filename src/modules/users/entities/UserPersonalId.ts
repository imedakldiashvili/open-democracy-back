import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"

@Entity('users_personals_ids')
export class UserPersonalId {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    personalId: string

    @Column()
    fullName: string

    @Column()
    uid: string

    @Column()
    expireOn: Date

    @Column()
    statusId: number

    @Column()
    createdUserId: number

}

