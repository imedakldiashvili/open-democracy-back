import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { PollingStation } from "../../bases/entities"
import { Election, ElectionBallot, ElectionBallotItem } from "."



@Entity('elections_pollins_stations_ballots_votes')
export class ElectionPollingStationBallotVote {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => PollingStation)
    @JoinColumn()
    pollingStation: PollingStation

    @OneToOne(() => ElectionBallot)
    @JoinColumn()
    electionBallot: ElectionBallot

    @OneToOne(() => ElectionBallotItem)
    @JoinColumn()
    electionBallotVotedItem: ElectionBallotItem
    
}
