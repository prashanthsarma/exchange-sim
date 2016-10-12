import { Side } from './Enums';
import { Order } from './Quote';

export interface IPositionData {
    Symbol?: string;
    Quantity: number;
    NotionalQuantity: number;
    PendingOrders?: Order[];
}

export class PositionData {
    Quantity: number;
    NotionalQuantity: number;
    PendingOrders: Order[];

    constructor(quantity: number) {
        this.Quantity = quantity;
        this.NotionalQuantity = quantity;
        this.PendingOrders = new Array<Order>();
    }

    UpdateNewOrder(order: Order) {
        this.PendingOrders.push(order);
        this.RecalculateNotional();
    }

    RecalculateNotional() {
        this.NotionalQuantity = this.Quantity;
        this.PendingOrders.forEach(o => {
            if (o.Side === Side.Buy) {
                this.NotionalQuantity += o.Quantity;
            }
            else {
                this.NotionalQuantity -= o.Quantity;
            }
        });
    }

    UpdateFillOrder(order: Order, isOnlyLastFillValid: boolean) {
        if (!isOnlyLastFillValid) {
            order.fills.forEach(f => {
                if (order.Side === Side.Buy) {
                    this.Quantity += (f.Quantity );
                }
                else {
                    this.Quantity -= (f.Quantity);
                }
            });
        }
        else {
            let f = order.fills[order.fills.length - 1];

            if (order.Side === Side.Buy) {
                this.Quantity += (f.Quantity );
            }
            else {
                this.Quantity -= (f.Quantity );
            }
        }
        if (order.RemainingQuantity === 0) {
            let index: number = this.PendingOrders.indexOf(order);
            this.PendingOrders.splice(index, 1);
        }
        this.RecalculateNotional();
    }

    CancelOrder(order: Order) {
        let index: number = this.PendingOrders.indexOf(order);
        if (index !== -1) {
            this.PendingOrders.splice(index, 1);
        }
        this.RecalculateNotional();
    }

}


export class CashPositionData extends PositionData {
    constructor(quantity: number) {
        super(quantity);
    }

    RecalculateNotional() {
        this.NotionalQuantity = this.Quantity;
        this.PendingOrders.forEach(o => {
            if (o.Side === Side.Buy) {
                this.NotionalQuantity -= (o.Quantity * o.Price);
            }
            else {
                this.NotionalQuantity += (o.Quantity * o.Price);
            }
        });
    }

    UpdateFillOrder(order: Order, isOnlyLastFillValid: boolean) {
        if (!isOnlyLastFillValid) {
            order.fills.forEach(f => {
                if (order.Side === Side.Buy) {
                    this.Quantity -= (f.Quantity * f.Price);
                }
                else {
                    this.Quantity += (f.Quantity * f.Price);
                }
            });
        }
        else {
            let f = order.fills[order.fills.length - 1];

            if (order.Side === Side.Buy) {
                this.Quantity -= (f.Quantity * f.Price);
            }
            else {
                this.Quantity += (f.Quantity * f.Price);
            }
        }
        if (order.RemainingQuantity === 0) {
            let index: number = this.PendingOrders.indexOf(order);
            this.PendingOrders.splice(index, 1);
        }
        this.RecalculateNotional();
    }
}
