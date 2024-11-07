export type ViewType = 'class' | 'asset';

export type Position = {
    id: number;
    asset: string;
    quantity: number;
    price: number;
};

export type Portfolio = {
    id: string;
    asOf: string;
    positions: Position[];
};

export type Asset = {
    id: string;
    name: string;
    type: string;
};

export type PortfolioViewPropsType = {
    view: ViewType;
    data: any[];
};

export type Price = {
    id: string;
    asset: string;
    price: number;
};
