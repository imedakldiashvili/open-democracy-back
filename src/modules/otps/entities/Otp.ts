import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"

@Entity('otps')
export class Otp {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column()
    value: string

    @Column()
    code: number

    @Column()
    expirationDate: Date

    @Column()
    isActive: boolean

    @Column()
    createdOn: Date

    @Column()
    createdBy: number

    @Column()
    updatedOn: Date

}

