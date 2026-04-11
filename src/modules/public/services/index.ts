import { appDownloadUrlRepository } from "../../app-downloads/repositoreis";
import { serviceBankAccounts } from "../../banks/services";
import { delegateGroupRepository, delegateRepository } from "../../delegates/repositories";
import { footerContactItemRepository, socialMediaLinkRepository } from "../../footer/repositories";
import { userDetailRepository } from "../../users/repositories";
import { voteRepository } from "../../votings/repositories";
import type { FooterSectionDataResponse, HeroSectionDataResponse } from "../types/responses";

export const serviceHeroSectionData = async (): Promise<HeroSectionDataResponse> => {
    const [
        bankAccounts,
        appDownloadUrls,
        totalDelegates,
        totalDelegateGroups,
        totalSupporters,
        totalVotesReceived,
    ] = await Promise.all([
        serviceBankAccounts(),
        appDownloadUrlRepository.find(),
        delegateRepository.count({ where: { isActive: true } }),
        delegateGroupRepository.count({ where: { isActive: true } }),
        userDetailRepository.count(),
        voteRepository.count(),
    ]);

    return {
        bankAccounts,
        appDownloadUrls,
        numbers: {
            totalDelegates,
            totalDelegateGroups,
            totalSupporters,
            totalVotesReceived,
        },
    };
};

export const serviceFooterSection = async (): Promise<FooterSectionDataResponse> => {
    const [contactInfo, socialMediaLinks] = await Promise.all([
        footerContactItemRepository.find({ order: { code: "ASC" } }),
        socialMediaLinkRepository.find({ order: { platform: "ASC" } }),
    ]);
    return { contactInfo, socialMediaLinks };
};
