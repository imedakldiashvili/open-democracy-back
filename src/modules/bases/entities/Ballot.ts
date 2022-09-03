import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { BallotItem } from "./BallotItem"
import { BallotPollingStation } from "./BallotPollingStation"
import { BallotType } from "./BallotType"

@Entity('base_ballots')
export class Ballot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToOne(() => BallotType)
    @JoinColumn()
    ballotType: BallotType
    
    @OneToMany(() => BallotItem, (ballotItem) => ballotItem.ballot)
    ballotItem: BallotItem[]

    @OneToMany(() => BallotPollingStation, (ballotPollingStation) => ballotPollingStation.ballot)
    ballotPollingStations: BallotPollingStation[]

}
