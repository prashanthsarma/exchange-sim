import { Side } from './Enums';

export enum OrderType { Specific, Market, Limit, StopLoss }

export enum ExecutionType { Day, IoC, FoK }

export enum OrderStatus { Initial, Pending, PartialFill, Fill, Cancelled }

export class Fill {
    Price: number;
    Quantity: number;
    Id: number;
}

export interface IQuote {
    Id?: number;
    User: string;
    Symbol: string;
    Side: Side;
    Price: number;
    Quantity: number;

    OrderType: OrderType;
    ExecutionType: ExecutionType;
    Timestamp: any;

    fills?: Fill[];
    SideString?: string;
    FillPercent?: number;
    FillAvgPrice?: number;
    Status?: OrderStatus;
    StatusString?: string;
    OrderTypeString?: string;
    TimeString?: string;
}

export class Order implements IQuote {
    Id: number;
    User: string;
    Symbol: string;
    Side: Side;
    Price: number;
    Quantity: number;
    OrderType: OrderType;
    ExecutionType: ExecutionType;
    Status: OrderStatus;
    Timestamp: Date;
    fills: Fill[] = new Array<Fill>();

    constructor(quote: IQuote) {
        this.Id = quote.Id;
        this.User = quote.User;
        this.Symbol = quote.Symbol;
        this.Side = quote.Side;
        this.Price = quote.Price;
        this.Quantity = quote.Quantity;
        this.OrderType = quote.OrderType;
        this.ExecutionType = quote.ExecutionType;
        this.Status = quote.Status;

        this.Timestamp = new Date(quote.Timestamp);
        this.fills = new Array<Fill>();
        if (quote.fills) {
            quote.fills.forEach(element => {
                this.fills.push(element);
            });
        }

    }

    public get SideString(): string {
        return Side[this.Side];
    }

    public get StatusString(): string {
        return OrderStatus[this.Status];
    }

    private _TimeString: string;
    public get TimeString(): string {
        this._TimeString = this.Timestamp.toLocaleString();
        return this._TimeString;
    }

    public get OrderTypeString(): string{
        return OrderType[this.OrderType];
    }


    public get FillPercent(): number {
        return this.FillQuantity * 100 / this.Quantity;
    }

    public get FillAvgPrice(): number {
        let priceSum = 0;
        for (let i = 0; i < this.fills.length; i++) {
            priceSum += (this.fills[i].Price * this.fills[i].Quantity);
        }
        return priceSum / this.FillQuantity;
    }

    public get FillQuantity(): number {
        let fillQty = 0;
        this.fills.forEach(element => {
            fillQty += element.Quantity;
        });
        return fillQty;
    }

    public get RemainingQuantity(): number {
        return this.Quantity - this.FillQuantity;
    }
}

// export class SerializableOrder extends Quote{
//     constructor(Order order){
//         this.Id = Order.
//     }
// }

export class Quote implements IQuote {
    Id: number;
    User: string;
    Symbol: string;
    Side: Side;
    Price: number;
    Quantity: number;
    OrderType: OrderType;
    ExecutionType: ExecutionType;
    Timestamp: Date;

    constructor(symbol: string, side: Side, price: number, quantity: number) {
        this.Symbol = symbol;
        this.Side = side;
        this.Price = price;
        this.Quantity = quantity;
    }
}
