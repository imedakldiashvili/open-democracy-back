import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Voter } from "../../votings/entities"

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userName: string

    @Column()
    email: string

    @Column()
    emailVerificationOtpId: number

    @Column()
    mobileNumber: string

    @Column()
    mobileNumberVerificationOtpId: number

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

    @OneToOne(() => Voter)
    @JoinColumn({name: "id"} )
    voter: Voter


}

