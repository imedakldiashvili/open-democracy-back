import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"



@Entity('banks_transactions')
export class BankTransaction {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    transactionUid: string

    @Column()
    transactionDate: Date

    @Column()
    transactionAccount: string

    @Column()
    transactionDescription: string

    @Column()
    transactionClientCode: string

    @Column()
    transactionClientName: string

    @Column()
    createdOn: Date
    
    @Column()
    transactionAmount: number

    @Column()
    createdBy: number
   
}
