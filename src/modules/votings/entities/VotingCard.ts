import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Election } from "../../elections/entities"
import { District } from "../../locations/entities"
import { Voter } from "./Voter"
import { VotingCardBallot } from "./VotingCardBallot"

@Entity('votings_cards')
export class VotingCard {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => Voter)
    @JoinColumn()
    voter: Voter

    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @OneToMany(() => VotingCardBallot, (votingCardBallot) => votingCardBallot.votingCard)
    votingCardBallots: VotingCardBallot[]

    @Column()
    createdAt: Date
    
}
