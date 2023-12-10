import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Election } from "../../elections/entities"
import { District } from "../../locations/entities"
import { Voter } from "./Voter"
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
    
    @OneToOne(() => Voter)
    @JoinColumn()
    voter: Voter

    @Column()
    districtId: number
    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @OneToMany(() => VotingCardBallot, (votingCardBallot) => votingCardBallot.votingCard)
    votingCardBallots: VotingCardBallot[]

    @Column()
    createdAt: Date
    
    
}
