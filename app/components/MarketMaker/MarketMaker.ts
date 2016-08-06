import { Component } from '@angular/core';
import { Side, ClientType } from '../../../Shared/Entities/Enums';
import { StockService } from '../Services/StockService';
import {FORM_DIRECTIVES} from '@angular/common';
import { ClientBase } from '../Base/ClientBase';
import { InputText } from 'primeng/primeng';
import {DataTable, Column, Button, Dropdown, Carousel} from 'primeng/primeng';
import {LoginService} from './../Login/LoginService';
/**
 * MarketMaker
 */
@Component({
    templateUrl: './app/components/MarketMaker/MarketMaker.html' ,
    selector: 'marketMaker',
    providers: [StockService, LoginService],
    directives: [DataTable, Column, Button, Dropdown, InputText, Carousel, FORM_DIRECTIVES]
})
export class MarketMaker extends ClientBase {

    constructor(stockService: StockService, loginService: LoginService) {
        super('Citi Market maker', ClientType.MarketMaker, stockService, loginService);
    }

    Init() {
        console.log('Initing market maker quotes');
    }


}


