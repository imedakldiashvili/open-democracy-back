import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { DelegateGroup } from "./DelegateGroup"
import { User } from "../../users/entities"





@Entity('delegates')
export class Delegate {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    numberOfSupporters: number

    @Column()
    valueDate: Date

    @OneToOne(() => DelegateGroup)
    @JoinColumn()
    delegateGroup: DelegateGroup   


    @OneToOne(() => User)
    @JoinColumn()
    user: User

   
}
