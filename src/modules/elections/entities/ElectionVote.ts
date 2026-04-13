import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity('elections_votes')
export class ElectionVote{

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    votingCardId: number

}
