import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('elections_ballots_items')
export class ElectionBallotItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    electionBallotId: number

    @Column()
    code: string

    @Column()
    name: string
    
}
