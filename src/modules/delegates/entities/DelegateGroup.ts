import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { Delegate } from "./Delegate"


@Entity('delegates_groups')
export class DelegateGroup {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    number: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    imageUrl: string
    
    @Column()
    color: string

    @Column()
    isActive: boolean

    @OneToMany(() => Delegate, (delegate) => delegate.delegateGroup)
    delegates: Delegate[]   

   
}
