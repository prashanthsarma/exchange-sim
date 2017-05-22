import { Component } from '@angular/core';
import { IPositionData } from '../../../Shared/Entities/PositionData';
import { ClientBase } from '../Client/ClientBase';
import {ClientSocketService, IMessage} from './../../ClientSocketService';
import {DataTableModule, SharedModule, ButtonModule} from 'primeng/primeng';

@Component({
    templateUrl: './app/components/Client/Position.html',
    selector: 'positions',
    
})
export class Position {

    Positions: IPositionData[];
    constructor(private socketService: ClientSocketService) {
        this.Positions = new Array<IPositionData>();
        this.socketService.OnMessage.on((a) => this.OnMessageReceived(a));
    }

    OnMessageReceived(msg: IMessage) {
        switch (msg.MessageType) {
            case 'Positions': this.OnPositionsReceived(msg);
                break;
            default:
                break;
        }
    }
    OnPositionsReceived(msg: IMessage) {
        this.Positions = JSON.parse(msg.Message);
    }

    OnRefreshClicked() {
        this.socketService.SendMessage('GetPositions', null);
    }

}
