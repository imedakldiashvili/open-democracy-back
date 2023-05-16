import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, PrimaryColumn } from "typeorm"
import { Currency } from "../../currencies/entities"
import { ActionType } from "./ActionType"

@Entity('actions')
export class Action {

    @PrimaryColumn()
    id: string

    @OneToOne(() => ActionType)
    @JoinColumn()
    actionType: ActionType

    @Column()
    actionId: number

    @Column()
    actionName: string

    @Column()
    hasAmount: boolean

    @Column()
    Amount: number

    @OneToOne(() => Currency)
    @JoinColumn()
    currency: Currency

    @Column()
    sessionUid: string

    @Column()
    createdBy: number

    @Column()
    createdOn: Date    

}
