import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Election } from "."
import { District } from "../../locations/entities"
import { UserDetail } from "../../users/entities/UserDetail"
import { ElectionVotingCardBallot } from "./ElectionVotingCardBallot"

@Entity('elections_voting_cards')
export class ElectionVotingCard {

    @PrimaryColumn()
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

    @OneToMany(() => ElectionVotingCardBallot, (electionVotingCardBallot) => electionVotingCardBallot.electionVotingCard)
    electionVotingCardBallots: ElectionVotingCardBallot[]

    @Column()
    statusId: number

    @Column()
    createdAt: Date
    
    @Column()
    votedAt: Date
    
}
