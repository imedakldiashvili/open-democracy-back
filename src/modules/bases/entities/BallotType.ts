import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('base_ballots_types')
export class BallotType {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string
    
}
