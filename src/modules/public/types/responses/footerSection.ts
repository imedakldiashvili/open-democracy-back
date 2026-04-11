import type { FooterContactItem } from "../../../footer/entities/FooterContactItem";
import type { SocialMediaLink } from "../../../footer/entities/SocialMediaLink";

/** `POST /public/footerSectionData` JSON პასუხი. */
export interface FooterSectionDataResponse {
    contactInfo: FooterContactItem[];
    socialMediaLinks: SocialMediaLink[];
}
