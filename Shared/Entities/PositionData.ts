import { Side } from './Enums';

export interface IPositionData {
    Symbol?: string;
    Quantity: number;
    NotionalQuantity: number;
}

export class PositionData {
    Quantity: number;
    NotionalQuantity: number;

    constructor(quantity: number) {
        this.Quantity = quantity;
        this.NotionalQuantity = this.Quantity;
    }

    UpdateNewOrder(side: Side, quantity: number) {
        if (side === Side.Buy) {
            this.NotionalQuantity += quantity;
        }
        else {
            this.NotionalQuantity -= quantity;
        }

    }

    UpdateFill(side: Side, quantity: number) {
        if (side === Side.Buy) {
            this.Quantity += quantity;
        }
        else {
            this.Quantity -= quantity;
        }
    }

    CancelOrder(side: Side, quantity: number) {
        if (side === Side.Buy) {
            this.UpdateNewOrder(Side.Sell, quantity);
        }
        else {
            this.UpdateNewOrder(Side.Buy, quantity);
        }
    }

}


export class CashPositionData extends PositionData {
    constructor(quantity: number) {
        super(quantity);
    }

    UpdateNewOrder(side: Side, quantity: number) {
        if (side === Side.Buy) {
            this.NotionalQuantity -= quantity;
        }
        else {
            this.NotionalQuantity += quantity;
        }
    }

    UpdateFill(side: Side, quantity: number) {
        if (side === Side.Buy) {
            this.Quantity -= quantity;
        }
        else {
            this.Quantity += quantity;
        }
    }
}
