import { OnInit } from '@angular/core';
import { Side, ClientType } from '../../../Shared/Entities/Enums';
import { StockService } from '../Services/StockService';
import { LoginService } from '../../LoginService';
import { IQuote, Order, OrderType, ExecutionType } from '../../../Shared/Entities/Quote';
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
    constructor(type: ClientType, service: StockService, loginService: LoginService) {
        this.StockService = service;
        this.loginService = loginService;
        this.InitQuote('');
        this.InitOrderTypes();

    }

    public get User(): string {
        return this.loginService.User;
    }

    ngOnInit(): any {
        if (!this.loginService.checkCredentials()) {
            return;
        }
        this.StockService.Init(this);
        this.InitQuote(this.User);
    }

    InitQuote(user: string) {
        this.NewQuote = {
            Symbol: 'TCS',
            Side: Side.Buy,
            Price: 2550,
            Quantity: 1000,
            User: user,
            OrderType: OrderType.Market,
            ExecutionType: ExecutionType.Day,
            Timestamp: new Date()
        };
    }

    InitOrderTypes() {
        this.OrderTypes = [];
    }


    Init() {
    }

    OnBuyClicked() {
        this.NewQuote.Side = Side.Buy;
        this.NewQuote.Timestamp = new Date(Date.now());
        this.SendQuote(this.NewQuote);
        this.InitQuote(this.loginService.User);
    }

    OnSellClicked() {
        this.NewQuote.Side = Side.Sell;
        this.NewQuote.Timestamp = new Date(Date.now());
        this.SendQuote(this.NewQuote);
        this.InitQuote(this.loginService.User);
    }

    OnGetOrders(orders: Order[]) {
        this.Orders = orders;
    }

    OnStockUpdate(order: Order): number {
        let exist = this.Orders.findIndex(o => o.Id === order.Id);
        if (exist !== -1) {
            this.Orders[exist] = order;
        }
        else {
            this.Orders.push(order);
        }
        return exist;
    }

    OnMarketDataUpdate(md: IMarketData) {
        let exist = this.MarketDatas.findIndex(m => m.Symbol === md.Symbol);
        if (exist !== -1) {
            this.MarketDatas[exist] = md;
        }
        else {
            this.MarketDatas.push(md);
        }
        return exist;
    }

    SendQuote(quote: IQuote) {
        this.StockService.SendQuote(quote);
    }

    CancelOrder(symbol: string, id: number) {
        this.StockService.CancelOrder(symbol, id);
    }
}



