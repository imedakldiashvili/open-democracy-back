import { Entity, Column, PrimaryColumn } from "typeorm"



@Entity('banks_tokens')
export class BankToken {

    @PrimaryColumn()
    id: string
    
    @Column()
    bank: string

    @Column()
    token: string

    @Column()
    tokenType: string

    @Column()
    expireIn: number

    @Column()
    createdOn: Date

    @Column()
    expiredOn: Date


   
}
