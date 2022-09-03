import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Politician } from "./Politician"

@Entity('base_organizations')
export class Organization {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string
    
    @OneToOne(() => Organization)
    @JoinColumn()
    organization: Organization

    @OneToMany(() => Politician, (politician) => politician.district)
    politicians: Politician[]

    @Column()
    isActive: boolean

}
