import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Election } from "../../elections/entities"
import { District } from "../../locations/entities"
import { UserDetail } from "../../users/entities/UserDetail"
import { VotingCardBallot } from "./VotingCardBallot"

@Entity('votings_cards')
export class VotingCard {

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

    @OneToMany(() => VotingCardBallot, (votingCardBallot) => votingCardBallot.votingCard)
    votingCardBallots: VotingCardBallot[]

    @Column()
    statusId: number

    @Column()
    createdAt: Date
    
    @Column()
    votedAt: Date
    
}
