import { Entity, Column, PrimaryColumn } from "typeorm"



@Entity('banks_bog_tokens')
export class BankBOGToken {

    @PrimaryColumn()
    id: string
    
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
