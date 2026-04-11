-- საჭირო ცხრილები serviceFooterSection / footer ენტითებისთვის (PostgreSQL).

CREATE TABLE IF NOT EXISTS footer_contact_items (
    code VARCHAR PRIMARY KEY,
    value VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS social_media_links (
    platform VARCHAR PRIMARY KEY,
    url VARCHAR NOT NULL
);
