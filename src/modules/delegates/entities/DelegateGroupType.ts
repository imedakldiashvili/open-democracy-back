import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { Delegate } from "./Delegate"
import { DelegateGroup } from "./DelegateGroup"


@Entity('delegates_groups_types')
export class DelegateGroupType {

    @PrimaryGeneratedColumn()
    id: number


    @Column()
    code: string

    @Column()
    name: string

    @Column()
    isActive: boolean

    @OneToMany(() => DelegateGroup, (delegateGroup) => delegateGroup.delegateGroupType)
    delegateGroups: DelegateGroup[]   

   
}
