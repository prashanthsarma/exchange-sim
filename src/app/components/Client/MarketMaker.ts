import { Component } from '@angular/core';
import { Side, ClientType, } from '../../../Shared/Entities/Enums';
import { StockService } from '../Services/StockService';
import { MarketMakerAIService } from '../../MarketMakerAIService';
import { IMarketData } from '../../../Shared/Entities/MarketData';
import { IQuote, Order, OrderType} from '../../../Shared/Entities/Quote';
import { ClientBase } from './ClientBase';
import {LoginService} from './../../LoginService';
/**
 * MarketMaker
 */
@Component({
    templateUrl: './app/components/Client/Client.html',
    selector: 'marketMaker',
    providers: [StockService]
})
export class MarketMaker extends ClientBase {
    private marketAI: MarketMakerAIService;
    constructor(stockService: StockService, loginService: LoginService, marketAI: MarketMakerAIService) {
        super(ClientType.MarketMaker, stockService, loginService);
        this.marketAI = marketAI;
        if (this.marketAI.marketMaker === undefined) {
            this.marketAI.SetMarketMaker(this);
        }
    }

    // ------Overriden methods-------------//
    onGetOrders(orders: Order[]) {
        super.OnGetOrders(orders);
        let pendingOrders = orders.filter(o => o.RemainingQuantity > 0);
        setTimeout(() => {
            this.marketAI.ExtractQuotesFromPreviousPendingOrders(pendingOrders);
        }, 0);

    }

    OnStockUpdate(order: Order): number {
        let exist = super.OnStockUpdate(order);
        if (exist !== -1) {
            setTimeout(() => {
                this.marketAI.OnExistingOrderUpdate(order);
            }, 0);
        }
        else {
            setTimeout(() => {
                this.marketAI.OnNewOrderUpdate(order);
            }, 0);
        }
        return exist;
    }

    OnMarketDataUpdate(md: IMarketData): number {
        let exist = super.OnMarketDataUpdate(md);
        if (exist !== -1) {
            this.marketAI.OnExistingMarketDataUpdate(md);
        }
        else {
            setTimeout(() => {
                this.marketAI.OnNewMarketDataUpdate(md);
            }, 3000);
        }
        return exist;
    }


    InitOrderTypes() {
        super.InitOrderTypes();
        this.OrderTypes.push({ label: 'Quote', value: OrderType.Specific });
    }

    InitQuote(user: string) {
        super.InitQuote(user);
        this.NewQuote.OrderType = OrderType.Specific;
    }
}




