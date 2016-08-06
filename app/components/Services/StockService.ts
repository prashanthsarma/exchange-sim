import {Injectable } from '@angular/core';
import { IQuote, Order } from '../../../Shared/Entities/Quote';
import { IMarketData } from '../../../Shared/Entities/MarketData';
import { ClientBase } from '../Base/ClientBase';
import {ClientSocketService, IMessage} from './../../ClientSocketService';



@Injectable()
export class StockService {
    private client: ClientBase;


    constructor( private socketService: ClientSocketService) {
    }

    Init(client: ClientBase) {
        this.client = client;
        this.socketService.OnMessage.on((a) => this.OnMessageReceived(a));
        this.socketService.SendMessage('GetOrders', null);
    }

    OnMessageReceived(msg: IMessage) {
        switch (msg.MessageType) {
          case 'GetOrdersResponse': this.OnGetOrdersResponseReceived(msg);
                break;
            case 'StockUpdate': this.OnStockUpdateReceived(msg);
                break;
            case 'MarketUpdate': this.OnMarketUpdateReceived(msg);
                break;
            default:
                break;
        }
    }


    
    private OnGetOrdersResponseReceived(msg: IMessage) {
        let quotes: IQuote[] = JSON.parse(msg.Message);
        this.client.Orders = new Array<Order>();
        quotes.forEach(element => {
            this.client.Orders.push(new Order(element));
        });
    }

    private OnStockUpdateReceived(msg: IMessage) {
        let order: Order = new Order(JSON.parse(msg.Message));
        let exist = this.client.Orders.findIndex(o => o.Id === order.Id);
        if (exist !== -1) {
            this.client.Orders[exist] = order;
        }
        else {
            this.client.Orders.push(order);
        }

    }

    private OnMarketUpdateReceived(msg: IMessage) {
        let md: IMarketData = JSON.parse(msg.Message);

        let exist = this.client.MarketDatas.findIndex(m => m.Symbol === md.Symbol);
        if (exist !== -1) {
            this.client.MarketDatas[exist] = md;
        }
        else {
            this.client.MarketDatas.push(md);
        }

    }

    SendQuote(q: IQuote) {
        this.socketService.SendMessage('quote', q);
    }
}
