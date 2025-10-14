import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, PrimaryColumn } from "typeorm"

@Entity('app_downloads_urls')
export class AppDownloadUrl {

    @PrimaryColumn()
    platform: string

    @Column()
    url: string

}
