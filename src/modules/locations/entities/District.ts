import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Ballot } from "../../ballots/entities"
import { Region } from "./Region"
import { Election } from "../../elections/entities"
import { UserDetail } from "../../users/entities"
import { TemplateBallotDistrict } from "../../templates/entities/TemplateBallotDistrict"

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

    @ManyToMany(() => Election)
    @JoinTable(
        {
            name: 'elections_districts', // table name for the junction table of this relation
            joinColumn: {
                name: 'district_id',
                referencedColumnName: 'id'
            },
            inverseJoinColumn: {
                name: 'election_id',
                referencedColumnName: 'id'
            }
        }
    )
    elections: Election[]


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

    @OneToMany(() => UserDetail, (userDetail) => userDetail.district)
    userDetails: UserDetail[]


    @OneToMany(() => TemplateBallotDistrict, (templateBallotDistrict) => templateBallotDistrict.district)
    templateBallotDistricts: TemplateBallotDistrict[]

    

}
