import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { Voter } from "../../votings/entities"
import { Region } from "./Region"

@Entity('districts')
export class District {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    regionId: number

    @ManyToMany(() => Ballot)
    @JoinTable(
        {
            name: 'ballots_districts', // table name for the junction table of this relation
            joinColumn: {
                name: 'district_id',
                referencedColumnName: 'id'
            },
            inverseJoinColumn: {
                name: 'ballot_Id',
                referencedColumnName: 'id'
            }
        }
    )
    ballots: Ballot[]

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region

    @OneToMany(() => Voter, (voter) => voter.district)
    voters: Voter[]

}
