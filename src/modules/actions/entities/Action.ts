import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, PrimaryColumn } from "typeorm"
import { Currency } from "../../currencies/entities"
import { ActionType } from "./ActionType"

@Entity('actions')
export class Action {

    @PrimaryColumn()
    id: string

    @Column()
    actionTypeId: number
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

    @Column()
    currencyId: number

    @OneToOne(() => Currency)
    @JoinColumn()
    currency: Currency

    @Column()
    sessionUid: string

    @Column()
    assingneTo: number

    @Column()
    createdBy: number

    @Column()
    createdOn: Date    

}
