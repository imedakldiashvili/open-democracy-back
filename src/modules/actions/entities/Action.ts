import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Currency } from "../../currencies/entities"
import { ActionType } from "./ActionType"

@Entity('actions')
export class Action {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ActionType)
    @JoinColumn()
    actionType: ActionType

    @Column()
    hasAmount: boolean

    @Column()
    userSessionId: string

    @Column()
    actionName: string
    
    @Column()
    Amount: number

    @OneToOne(() => Currency)
    @JoinColumn()
    currency: Currency

    @Column()
    createdBy: number

    @Column()
    createdOn: Date
    

}
