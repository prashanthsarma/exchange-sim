import { Injectable } from '@angular/core';
import { Side } from '../../../Shared/Entities/Enums';
import { IMarketData } from '../../../Shared/Entities/MarketData';
import { IQuote, Order, OrderType, ExecutionType } from '../../../Shared/Entities/Quote';
import { MarketMaker } from '../Client/MarketMaker';

export class SymbolQuoteHistory {
    MarketData: IMarketData;
    PreviousQuotePrice: IMarketData;
    BuyQuotes: IQuote[];
    SellQuotes: IQuote[];
    PreviousQuoteSides: Side[];
    constructor() {
        this.BuyQuotes = new Array<IQuote>();
        this.SellQuotes = new Array<IQuote>();
        this.PreviousQuoteSides = new Array<Side>();
    }
}

@Injectable()
export class MarketMakerAIService {
    private SymbolQuoteMap: { [Symbol: string]: SymbolQuoteHistory };
    public marketMaker: MarketMaker;
    constructor() {
        this.SymbolQuoteMap = {};
    }
    GetVariationForSymbol(symbol: string): number {
        return 0.001;
    }

    ExtractQuotesFromPreviousPendingOrders = (orders: Order[]) => {
        orders.forEach(o => {
            this.OnNewOrderUpdate(o);
        });
    }

    OnNewOrderUpdate = (o: Order) => {
        let quoteHistory = this.SymbolQuoteMap[o.Symbol];
        if (quoteHistory === undefined) {
            quoteHistory = new SymbolQuoteHistory();
            this.SymbolQuoteMap[o.Symbol] = quoteHistory;
        }
        if (o.Side === Side.Buy) {
            quoteHistory.BuyQuotes.push(o);
        }
        else {
            quoteHistory.SellQuotes.push(o);
        }
    }

    OnNewMarketDataUpdate = (md: IMarketData) => {
        let quoteHistory = this.SymbolQuoteMap[md.Symbol];
        if (quoteHistory === undefined) {
            quoteHistory = new SymbolQuoteHistory();
            this.SymbolQuoteMap[md.Symbol] = quoteHistory;
        }
        quoteHistory.MarketData = md;
        quoteHistory.PreviousQuotePrice = { Ask: md.Last, Bid: md.Last, Last: md.Last };
        this.SendNewQuoteIfRequired(quoteHistory);
    }

    OnExistingMarketDataUpdate = (md: IMarketData) => {
        let quoteHistory = this.SymbolQuoteMap[md.Symbol];
        if (quoteHistory === undefined) {
            quoteHistory = new SymbolQuoteHistory();
            this.SymbolQuoteMap[md.Symbol] = quoteHistory;
        }
        quoteHistory.MarketData = md;
    }

    OnExistingOrderUpdate(order: Order) {
        let quoteHistory = this.SymbolQuoteMap[order.Symbol];
        if (quoteHistory === undefined) {
            quoteHistory = new SymbolQuoteHistory();
            this.SymbolQuoteMap[order.Symbol] = quoteHistory;
        }
        if (order.FillPercent === 100) {
            quoteHistory.PreviousQuoteSides.push(order.Side);
            if (quoteHistory.PreviousQuoteSides.length > 5) {
                quoteHistory.PreviousQuoteSides.shift();
            }
            if (order.Side === Side.Buy) {
                let index = quoteHistory.BuyQuotes.findIndex(o => o.Id === order.Id);
                if (index !== -1) {
                    quoteHistory.BuyQuotes.splice(index, 1);
                }
            }
            else if (order.Side === Side.Sell) {
                let index = quoteHistory.SellQuotes.findIndex(o => o.Id === order.Id);
                if (index !== -1) {
                    quoteHistory.SellQuotes.splice(index, 1);
                }
            }
            this.SendNewQuoteIfRequired(quoteHistory);
        }
    }

    CreateMarketMakerQuote(quoteHistory: SymbolQuoteHistory, price: number, side: Side) {
        let newQuote: IQuote = {
            Symbol: quoteHistory.MarketData.Symbol,
            Side: side,
            Price: price,
            Quantity: 1000,
            User: this.marketMaker.User,
            OrderType: OrderType.Specific,
            ExecutionType: ExecutionType.Day,
            Timestamp: new Date(Date.now())
        };
        if (side === Side.Sell) {
            quoteHistory.PreviousQuotePrice.Ask = price;
        }
        else if (side === Side.Buy) {
            quoteHistory.PreviousQuotePrice.Bid = price;
        }
        this.marketMaker.SendQuote(newQuote);
    }

    SendNewQuoteIfRequired(quoteHistory: SymbolQuoteHistory) {
        if (quoteHistory.BuyQuotes.length < 1) {
            //let buy = quoteHistory.BuyQuotes.pop();
            //this.marketMaker.CancelOrder(quoteHistory.MarketData.Symbol, buy.Id);
            let buyPrice = this.GetNewPrice(quoteHistory, Side.Buy);
            this.CreateMarketMakerQuote(quoteHistory, buyPrice, Side.Buy);

        }

        if (quoteHistory.SellQuotes.length < 1) {
            //let sell = quoteHistory.SellQuotes.pop();
            //this.marketMaker.CancelOrder(quoteHistory.MarketData.Symbol, sell.Id);
            let sellPrice = this.GetNewPrice(quoteHistory, Side.Sell);
            this.CreateMarketMakerQuote(quoteHistory, sellPrice, Side.Sell);

        }

    }

    private CancelOrder(symbol: string, id: number) {
        this.marketMaker.CancelOrder(symbol, id);
    }

    private GetNewPrice(quoteHistory: SymbolQuoteHistory, side: Side): number {
        let initialSpread = 0.0005;
        let sideMultiplier = 1;
        for (let i = quoteHistory.PreviousQuoteSides.length - 1; i >= 0; i--) {
            if (quoteHistory.PreviousQuoteSides[i] === side) {
                sideMultiplier += 0.1 * (5 - i);
            }
            else {
                sideMultiplier -= 0.1 * (5 - i);
            }
        }
        let sideMovement = (quoteHistory.PreviousQuotePrice.Bid + quoteHistory.PreviousQuotePrice.Ask) * initialSpread * sideMultiplier;
        let sentimentMultiplier = 0;
        let sentimentMovement = quoteHistory.MarketData.Last * initialSpread * sentimentMultiplier;

        let price = 0; // quoteHistory.MarketData.Last;
        if (side === Side.Sell) {
            price = quoteHistory.PreviousQuotePrice.Bid;
            price += sideMovement;
            price += sentimentMovement;
        }
        else {
            price = quoteHistory.PreviousQuotePrice.Ask;
            price -= sideMovement;
            price -= sentimentMovement;

        }
        price = Math.round(price * 100) / 100;
        return price;
    }
}
