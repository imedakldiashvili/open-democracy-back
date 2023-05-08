import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Action } from "./Action"

@Entity('actions_types')
export class ActionType {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToMany(() => Action, (action) => action.actionType)
    actions: Action[]
  
    @Column()
    color: string

}
