import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { ElectionBallot } from "../entities"

@Entity('elections_ballots_items')
export class ElectionBallotItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string
    
    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot
    
}
