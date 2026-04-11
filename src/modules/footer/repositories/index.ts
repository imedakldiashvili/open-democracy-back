import { appDataSource } from "../../../datasources";
import { FooterContactItem } from "../entities/FooterContactItem";
import { SocialMediaLink } from "../entities/SocialMediaLink";

export const footerContactItemRepository = appDataSource.getRepository(FooterContactItem);
export const socialMediaLinkRepository = appDataSource.getRepository(SocialMediaLink);
