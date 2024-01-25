import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { ElectionStatus } from "./ElectionStatus"
import { ElectionStatusSchedule } from "./ElectionStatusSchedule"
import { District } from "../../locations/entities"




@Entity('elections')
export class Election {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    uid: string;

    @Column()
    code: string

    @Column()
    name: string
    
    @Column()
    registeredVoters: number

    @Column()
    participantVoters: number

    @OneToOne(() => ElectionStatusSchedule)
    @JoinColumn()
    actualStatusSchedule: ElectionStatusSchedule 

    @OneToMany(() => Ballot, (ballot) => ballot.election)
    ballots: Ballot[]  

    @OneToMany(() => ElectionStatusSchedule, (statusSchedule) => statusSchedule.election)
    statusSchedule: ElectionStatusSchedule[] 
    
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

    @Column()
    valueDateFrom: Date

    @Column()
    valueDateTo: Date

    @Column()
    createdAt: Date

   
}
