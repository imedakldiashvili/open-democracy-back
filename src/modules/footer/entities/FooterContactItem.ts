import { Column, Entity, PrimaryColumn } from "typeorm";

/** საკონტაქტო ველები key/value სახით (`footer_contact_items`). */
@Entity("footer_contact_items")
export class FooterContactItem {
    @PrimaryColumn()
    code: string;

    @Column()
    value: string;
}
