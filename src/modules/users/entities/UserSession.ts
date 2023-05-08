import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "../entities"


@Entity('users_sessions')
export class UserSession {

    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    sessionUid: string

    @Column()
    deviceUid: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @CreateDateColumn()
    updatedAt: Date
    
    @Column()
    isActive: boolean

    @Column()
    passwordIsTemporary: boolean
    
}
