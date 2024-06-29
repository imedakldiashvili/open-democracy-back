import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"



@Entity('banks_transactions')
export class BankTransaction {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    channelCode: string

    @Column()
    transactionUid: string

    @Column()
    transactionDate: Date

    @Column()
    transactionAccount: string


    @Column()
    transactionAccountMask: string

    @Column()
    transactionDescription: string

    @Column()
    transactionClientCode: string

    @Column()
    transactionClientName: string

    @Column()
    createdOn: Date
    
    @Column("decimal", { precision: 5, scale: 2 })
    transactionAmount: number

    @Column()
    createdBy: number
   
}
