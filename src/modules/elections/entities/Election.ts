import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { ElectionStatus } from "./ElectionStatus"
import { ElectionTimePeriod } from "./ElectionTImesPeriods"
import { District } from "../../locations/entities"




@Entity('elections')
export class Election {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    valueDatePublish: Date

    @Column()
    valueDate: Date    

    @Column()
    valueDateStart: Date
    
    @Column()
    valueDateFinish: Date
    
    @Column()
    registeredVoters: number

    @Column()
    participantVoters: number

    @Column()
    statusId: number

    @OneToOne(() => ElectionStatus)
    @JoinColumn()
    status: ElectionStatus

    @OneToMany(() => Ballot, (ballot) => ballot.election)
    ballots: Ballot[]  

    @OneToMany(() => ElectionTimePeriod, (timePeriod) => timePeriod.election)
    timePeriods: ElectionTimePeriod[] 
    
    @ManyToMany(() => District)
    @JoinTable(
        {
            name: 'elections_districts', // table name for the junction table of this relation
            joinColumn: {
                
                name: 'election_id',
                referencedColumnName: 'id'

            },
            inverseJoinColumn: {
                name: 'district_id',
                referencedColumnName: 'id'
            }
        }
    )
    districts: District[]
   
}
