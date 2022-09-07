import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { District, PollingStation, Region } from "../../bases/entities"
import { Election, ElectionBallot, ElectionPollingStationBallot, ElectionPollingStationVoter } from "../entities"


@Entity('elections_pollings_stations')
export class ElectionPollingStation {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => PollingStation)
    @JoinColumn()
    pollingStation: PollingStation

    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region

    @OneToMany(() => ElectionPollingStationVoter, (electionPollingStationVoter) => electionPollingStationVoter.electionPollingStation)
    @JoinColumn()
    electionPollingStationVoters: ElectionPollingStationVoter[]

    @OneToMany(() => ElectionPollingStationBallot, (electionPollingStationBallot) => electionPollingStationBallot.electionPollingStation)
    @JoinColumn()
    electionPollingStationBallots: ElectionPollingStationBallot[]


        
}
