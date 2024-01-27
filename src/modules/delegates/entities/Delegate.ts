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
    valueDateNumberOfSupporters: Date

    @Column()
    valueDateFrom: Date
    @Column()
    valueDateTo: Date

    @OneToOne(() => DelegateGroup)
    @JoinColumn()
    delegateGroup: DelegateGroup   

    @OneToOne(() => User)
    @JoinColumn()
    user: User
   
}
