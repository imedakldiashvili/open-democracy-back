import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { ElectionBallot } from "./ElectionBallot"

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

    
    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot
    
}
