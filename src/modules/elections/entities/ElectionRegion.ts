import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Region } from "../../bases/entities"
import { Election, ElectionBallot } from "../entities"


@Entity('elections_regions')
export class ElectionRegion {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region

}
