import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"

@Entity('users_passwords')
export class UserPassword {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    userId: number

    @Column()
    passwordSalt: string

    @Column()
    passwordHash: string

    @Column()
    isTemporary: boolean

    @Column()
    isActive: boolean

    @Column()
    createdOn: Date

    @Column()
    createdBy: number

}

