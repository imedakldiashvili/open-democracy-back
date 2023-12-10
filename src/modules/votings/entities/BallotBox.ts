import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { Election } from "../../elections/entities"

@Entity('ballots_boxes')
export class BallotBox {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    requestPrivateKey: string
    
    @OneToOne(() => Election)
    @JoinColumn()
    election: Election
    
}
