import { Component } from '@angular/core';
import { Side, ClientType } from '../../../Shared/Entities/Enums';
import { StockService } from '../Services/StockService';
import { IMarketData } from '../../../Shared/Entities/MarketData';
import { IQuote, Order, OrderType, ExecutionType } from '../../../Shared/Entities/Quote';
import { ClientBase } from './ClientBase';
import { InputText } from 'primeng/primeng';
import {DataTableModule, SharedModule, ButtonModule, DropdownModule, CarouselModule, SpinnerModule} from 'primeng/primeng';
import {LoginService} from './../../LoginService';
/**
 * MarketMaker
 */
@Component({
    templateUrl: './app/components/Client/Client.html',
    selector: 'user',
    providers: [StockService],
    
})
export class User extends ClientBase {

    constructor(stockService: StockService, loginService: LoginService) {
        super(ClientType.MarketMaker, stockService, loginService);

    }

    InitOrderTypes() {
        super.InitOrderTypes();
        this.OrderTypes.push({ label: 'Market', value: OrderType.Market });
        this.OrderTypes.push({ label: 'Limit', value: OrderType.Limit });
    }


}
