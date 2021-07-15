export interface Item {
    buyNow?: boolean;
    auction?: boolean;
    advert?: boolean;
    price?: number;
    priceStr?: string;
    title?: string;
    attributes?: { k: string; v: string; }[];
    link?: string;
}
