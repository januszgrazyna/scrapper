import { SearchOptionsBase } from "../../SearchOptionsBase";

export interface SearchOptions extends SearchOptionsBase {
    categoryUrlString: string;
    searchTerm: string;
    notificationExpr?: string;
    interval?: number;
    page?: number;
    buyNow?: boolean;
    auction?: boolean;
    advert?: boolean;
    priceFrom?: number;
    maxPage?: number; 
    maxRepeat?: number;
}
