import { OnInit } from '@angular/core';
import { Side, ClientType } from '../../../Shared/Entities/Enums';
import { ClientDetail } from '../../../Shared/ClientDetail';
import { StockService } from '../Services/StockService';
import { LoginService } from '../Login/LoginService';
import { IQuote, Quote, Order, OrderType, ExecutionType } from '../../../Shared/Entities/Quote';
import { IMarketData } from '../../../Shared/Entities/MarketData';
import { SelectItem} from 'primeng/primeng';

export class ClientBase implements OnInit {

    Name: string;
    ConnectionId: number;
    StockService: StockService;
    loginService: LoginService;

    Orders: Order[] = new Array<Order>();
    MarketDatas: IMarketData[] = new Array<IMarketData>();

    NewQuote: IQuote;
    OrderTypes: SelectItem[];
    selType: string;
    constructor(user: string, type: ClientType, service: StockService, loginService: LoginService) {
        this.StockService = service;
        this.loginService = loginService;

        this.InitQuote();
        this.InitOrderTypes();
    }

    ngOnInit(): any {
        if (!this.loginService.checkCredentials()) {
            return;
        }

        this.StockService.Init(this);
    }

    InitQuote() {
        this.NewQuote = new Quote('TCS', Side.Buy, 2550, 1000);
        this.NewQuote.OrderType = OrderType.Specific;
        this.NewQuote.ExecutionType = ExecutionType.Day;
    }

    InitOrderTypes() {
        this.OrderTypes = [];
        this.OrderTypes.push({ label: 'Select', value: OrderType.Specific });
        this.OrderTypes.push({ label: 'Market', value: OrderType.Market });
        this.OrderTypes.push({ label: 'Limit', value: OrderType.Limit });
    }


    Init() {
    }

    OnBuyClicked() {
        this.NewQuote.Side = Side.Buy;
        this.NewQuote.Timestamp = new Date(Date.now());
        this.StockService.SendQuote(this.NewQuote);
        this.InitQuote();
    }

    OnSellClicked() {
        this.NewQuote.Side = Side.Sell;
        this.NewQuote.Timestamp = new Date(Date.now());
        this.StockService.SendQuote(this.NewQuote);
        this.InitQuote();
    }
}



