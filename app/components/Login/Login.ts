import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES} from '@angular/router';
import { CORE_DIRECTIVES } from '@angular/common';
import {LoginService} from './../../LoginService';
import { ClientDetail } from '../../../Shared/ClientDetail';
import { ClientType } from '../../../Shared/Entities/Enums';
import { Button, InputText, SelectItem, Dropdown } from 'primeng/primeng';

@Component({
    selector: 'login-m',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, Button, InputText, Dropdown],
    template: `
        <div class="container" >
            <div class="title">
                Welcome  {{diagnostic}}
            </div>
            <form>
            <div class="panel-body">
                <div class="row">
                    <div class="input-field col s12">
                        <label for="username">User name</label>
                        <input id="username" type="text" pInputText [(ngModel)]="clientDetail.User" name="username"/>

                         <label for="clientType">User type</label>
                        <p-dropdown id="clientType" [options]="ClientTypes" [(ngModel)]="clientDetail.Type" name="usertype"></p-dropdown> 
                    </div>
                </div>
 
                <span>{{errorMsg}}</span>
                <button pButton type="button" (click)="OnLoginClicked()" label="Login"></button>
            </div>
            </form>
        </div>
`
})

export class Login {

    public clientDetail: ClientDetail;
    public errorMsg = '';
    public ClientTypes: SelectItem[];
    constructor(
        private loginService: LoginService) {
        this.clientDetail = new ClientDetail();
        this.clientDetail.User = 'new user';
        this.clientDetail.Type = ClientType.MarketMaker;

        this.ClientTypes = [];
        this.ClientTypes.push({ label: 'Market Maker', value: ClientType.MarketMaker });
        this.ClientTypes.push({ label: 'User', value: ClientType.User });
    }

    OnLoginClicked() {
        if (!this.loginService.login(this.clientDetail)) {
            this.errorMsg = 'Failed to login';
        }
    }
}
