import {ClientSocketService, IMessage} from './ClientSocketService';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

Config: any;

    constructor(private socketService: ClientSocketService) {
        this.socketService.OnMessage.on((a) => this.OnMessageReceived(a));

    }

    private OnMessageReceived(msg: IMessage) {
        switch (msg.MessageType) {
            case 'ClientConfig': this.OnClientConfigReceived(msg);
                break;
            default:
                break;
        }
    }

    OnClientConfigReceived = (msg: IMessage) => {
        this.Config = JSON.parse(msg.Message);
    }
}
