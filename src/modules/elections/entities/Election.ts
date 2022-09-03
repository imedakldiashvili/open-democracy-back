import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"
import { ElectionBallot } from "../entities"


@Entity('elections')
export class Election {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    date: Date

    @OneToMany(() => ElectionBallot, (electionBallot) => electionBallot.election)
    @JoinColumn()
    electionBallots: ElectionBallot[]
    
}
