import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Election } from "../../elections/entities"
import { District } from "../../locations/entities"
import { BallotItem } from "./BallotItem"
import { BallotType } from "./BallotType"

@Entity('ballots')
export class Ballot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    index: number

    @Column()
    code: string

    @Column()
    name: string


    @ManyToMany(() => District)
    @JoinTable(
        {
            name: 'ballots_districts', // table name for the junction table of this relation
            joinColumn: {
                name: 'ballot_id',
                referencedColumnName: 'id'

            },
            inverseJoinColumn: {
                name: 'district_id',
                referencedColumnName: 'id'
            }
        }
    )
    districts: District[]


    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => BallotType)
    @JoinColumn()
    ballotType: BallotType



    @OneToMany(() => BallotItem, (ballotItem) => ballotItem.ballot)
    ballotItems: BallotItem[]


}
