import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ClientSocketService, IMessage} from './ClientSocketService';
import { ClientDetail } from '../Shared/ClientDetail';
import { LoginResponse } from '../Shared/Responses/LoginResponse';


@Injectable()
export class LoginService {
    private clientDetail: ClientDetail;

    constructor(
        private _router: Router,
        private socketService: ClientSocketService) {

        this.socketService.OnMessage.on((a) => this.OnMessageReceived(a));
    }

    logout() {
        localStorage.removeItem(this.clientDetail.User);
        this._router.navigate(['/login']);
    }

    login(clientDetail: ClientDetail) {
        this.clientDetail = clientDetail;
        this.socketService.SendMessage('login', clientDetail);
        return true;
    }


    private OnMessageReceived(msg: IMessage) {
        switch (msg.MessageType) {
            case 'loginStatus': this.OnReceivedloginStatus(msg);
                break;
            case 'relogin': this._router.navigate(['/login']);
            break;
            default:
                break;
        }
    }

    private OnReceivedloginStatus(msg: IMessage) {
        let loginResponse: LoginResponse = JSON.parse(msg.Message);

        if (this.clientDetail.User === loginResponse.User &&
            loginResponse.Status === 'success') {
            console.log('Login success for user: ' + this.clientDetail.User);
            this.socketService.socketId = loginResponse.ConnectionId;
            console.log('Acquired Socket Id: ' + this.socketService.socketId);
            localStorage.setItem(this.clientDetail.User, this.socketService.socketId);
            this._router.navigate(['/user']).catch((err) => console.log(err));
        }
        else {
            console.log('Login failed for user: ' + this.clientDetail.User);
        }
    }

    checkCredentials():boolean {
        if (this.clientDetail === undefined || localStorage.getItem(this.clientDetail.User) === null) {
            this._router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
