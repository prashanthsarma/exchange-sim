import { Component, OnInit } from '@angular/core';
import { Side, ClientType } from '../../../Shared/Entities/Enums';
import { StockService } from '../Services/StockService';

import { ClientBase } from '../Base/ClientBase';
import { InputText } from 'primeng/primeng';
import {DataTable, Column, Button, Dropdown, Carousel} from 'primeng/primeng';
import {LoginService} from './../../LoginService';
/**
 * MarketMaker
 */
@Component({
    templateUrl: './app/components/MarketMaker/MarketMaker.html',
    selector: 'marketMaker',
    providers: [StockService],
    directives: [DataTable, Column, Button, Dropdown, InputText, Carousel]
})
export class MarketMaker extends ClientBase {

    constructor(stockService: StockService, loginService: LoginService) {
        super('Citi Market maker', ClientType.MarketMaker, stockService, loginService);

    }


}


