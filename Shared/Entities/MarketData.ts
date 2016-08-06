export interface IMarketData {
    Symbol?: string;
    Bid: number;
    Ask: number;
    Last: number;
}

export class MarketData {
    Bid: number;
    Ask: number;
    Last: number;
}
