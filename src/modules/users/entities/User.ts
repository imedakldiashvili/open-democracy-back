import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    emailVerificationOtpId: number

    @Column()
    mobile: string

    @Column()
    mobileIsVerified: boolean

    @Column()
    mobileVerificationOtpId: number

    @Column()
    mobileVerificationDate: Date

    @Column()
    clientCode: string

    @Column()
    userFullName: string

    @Column()
    clientIsVerified: boolean

    @Column()
    clientId: number

    @Column()
    clientVerificationDate: Date

    @Column()
    isActive: boolean

    @Column()
    createdOn: Date

    @Column()
    createdBy: number

    @Column()
    updatedOn: Date

    @Column()
    updatedBy: number

    @Column()
    comment: string

    @Column()
    deleted: boolean
    
    @Column()
    deletedOn: Date

    @Column()
    deletedBy: number

}

