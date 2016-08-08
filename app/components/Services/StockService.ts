import {Injectable } from '@angular/core';
import { IQuote, Order } from '../../../Shared/Entities/Quote';
import { IMarketData } from '../../../Shared/Entities/MarketData';
import { ClientBase } from '../Client/ClientBase';
import {ClientSocketService, IMessage} from './../../ClientSocketService';



@Injectable()
export class StockService {
    private client: ClientBase;


    constructor(private socketService: ClientSocketService) {
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
        let orders: Order[] = new Array<Order>();
        quotes.forEach(element => {
            orders.push(new Order(element));
        });
        this.client.OnGetOrders(orders);
    }

    private OnStockUpdateReceived(msg: IMessage) {
        let order: Order = new Order(JSON.parse(msg.Message));
        this.client.OnStockUpdate(order);
    }

    private OnMarketUpdateReceived(msg: IMessage) {
        let md: IMarketData = JSON.parse(msg.Message);
        this.client.OnMarketDataUpdate(md);
    }

    SendQuote(q: IQuote) {
        this.socketService.SendMessage('quote', q);
    }

    CancelOrder(symbol: string, id: number) {
        this.socketService.SendMessage('CancelOrder', { Id: id, Symbol: symbol });
    }
}
