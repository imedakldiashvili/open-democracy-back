import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { District, Region } from "../../bases/entities"
import { Election } from "../entities"

@Entity('elections_districts')
export class ElectionDistrict {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Election)
    @JoinColumn()
    election: Election

    @OneToOne(() => District)
    @JoinColumn()
    district: District

    @OneToOne(() => Region)
    @JoinColumn()
    region: Region
        
}
