import { AppDownloadUrl } from "../../../app-downloads/entities/AppDownloadUrl";
import { BankSetting } from "../../../banks/entities/BankSetting";

/** ჯამური მაჩვენებლები hero სექციისთვის. */
export interface HeroSectionNumbers {
    /** აქტიური დელეგატების რაოდენობა (`delegates.is_active`). */
    totalDelegates: number;
    /** აქტიური დელეგატების ჯგუფების რაოდენობა (`delegates_groups.is_active`). */
    totalDelegateGroups: number;
    /** მხარდამჭერების რაოდენობა — `users_details` ჩანაწერების სრული count. */
    totalSupporters: number;
    /** მიღებული ხმების რაოდენობა — `votes` ცხრილის ჩანაწერების count (ერთი ჩანაწერი თითო წარმატებულ ხმის მიცემაზე). */
    totalVotesReceived: number;
}

/**
 * `POST /public/heroSectionData` JSON პასუხის ფორმა (არა კლასი — სერვისი უბრალო ობიექტს აბრუნებს).
 */
export interface HeroSectionDataResponse {
    /** ბანკის ანგარიშების/რეკვიზიტების ჩანაწერები (`banks_settings`, კოდი `%ACCOUNT%`). */
    bankAccounts: BankSetting[];
    /** აპის ჩამოტვირთვის ბმულები პლატფორმის მიხედვით. */
    appDownloadUrls: AppDownloadUrl[];
    numbers: HeroSectionNumbers;
}
