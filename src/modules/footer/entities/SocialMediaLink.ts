import { Column, Entity, PrimaryColumn } from "typeorm";

/** სოციალური ქსელის ბმულები (`social_media_links`). */
@Entity("social_media_links")
export class SocialMediaLink {
    @PrimaryColumn()
    platform: string;

    @Column()
    url: string;
}
