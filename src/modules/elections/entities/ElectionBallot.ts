import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('elections_ballots')
export class ElectionBallot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    electionId: number

    @Column()
    ballotTypeId: number


    @Column()
    code: string

    @Column()
    name: string
    
}
