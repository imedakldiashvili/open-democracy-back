import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { Delegate } from "./Delegate"


@Entity('delegates_groups')
export class DelegateGroup {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToMany(() => Delegate, (delegate) => delegate.delegateGroup)
    delegates: Delegate[]   

   
}
