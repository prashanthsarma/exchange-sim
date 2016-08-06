import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';

import { LiteEvent, ILiteEvent } from './components/LiteEvent/LiteEvent';


@Injectable()
export class ClientSocketService {
    private socket: SocketIOClient.Socket;
    socketId: string;
    private onMessage = new LiteEvent<IMessage>();
    public get OnMessage(): ILiteEvent<IMessage> {
        return this.onMessage;
    }

    constructor() {
        this.socket = io('http://localhost:3002');
        this.ListenEvent('loginStatus');
        this.ListenEvent('GetOrdersResponse');
        this.ListenEvent('OrderUpdate');
        this.ListenEvent('StockUpdate');
        this.ListenEvent('MarketUpdate');
    }

    SendMessage(type: string, obj: any) {
        this.socket.emit(type, JSON.stringify(obj));
    }

    private ListenEvent(eventType: string) {
        let service = this;
        console.log('Listening to event: ' + eventType);
        service.socket.on(eventType, (msg: string) => service.RaiseEvent(eventType, msg));
    }

    private RaiseEvent(type: string, message: string) {
        console.log('Type: ' + type + 'Message: ' + message);
        let eMsg: IMessage = { MessageType: type, Message: message };
        this.onMessage.trigger(eMsg);
    }
}
export interface IMessage {
    MessageType: string;
    Message: string;
}
