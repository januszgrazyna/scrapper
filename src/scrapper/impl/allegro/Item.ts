export interface Attribute 
{ 
    k: string; 
    v: string; 
};

export interface Item {
    buyNow?: boolean;
    auction?: boolean;
    advert?: boolean;
    price?: number;
    priceStr?: string;
    title?: string;
    attributes?: Attribute[];
    link?: string;
}
