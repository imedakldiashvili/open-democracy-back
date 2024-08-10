import { Entity, Column, PrimaryColumn } from "typeorm"



@Entity('banks_settings')
export class BankSetting {

    @PrimaryColumn()
    id: string
    
    @Column()
    code: string

    @Column()
    value: string
  
}
