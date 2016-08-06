import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, RouterConfig} from '@angular/router';
import {ClientSocketService} from './ClientSocketService';
import {LoginService} from './components/Login/LoginService';

@Component({
    selector: 'my-app',
    directives: [ROUTER_DIRECTIVES],
    providers: [ClientSocketService, LoginService],
    template: `<div>
            <router-outlet></router-outlet>
            </div>    
        `
})
export class AppComponent {
    constructor(public router: Router, socketService: ClientSocketService) {

    }
}
