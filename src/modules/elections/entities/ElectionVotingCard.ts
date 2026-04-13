import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Election } from "."
import { District } from "../../locations/entities"
import { UserDetail } from "../../users/entities/UserDetail"
import { ElectionVoteCardBallot } from "./ElectionVotingCardBallot"

@Entity('elections_votes_cards')
export class ElectionVoteCard {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    electionId: number
    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @Column()
    voterId: number
    
    @OneToOne(() => UserDetail)
    @JoinColumn()
    voter: UserDetail

    @Column()
    districtId: number

    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @OneToMany(() => ElectionVoteCardBallot, (electionVoteCardBallot) => electionVoteCardBallot.electionVoteCard)
    electionVoteCardBallots: ElectionVoteCardBallot[]

    @Column()
    statusId: number

    @Column()
    createdAt: Date
    
    @Column()
    votedAt: Date
    
}
