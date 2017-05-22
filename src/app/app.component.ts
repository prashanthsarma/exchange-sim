import { Component } from '@angular/core';
import { Router} from '@angular/router';
import {ClientSocketService} from './ClientSocketService';

@Component({
    selector: 'my-app',
    template: `<div>
            <router-outlet></router-outlet>
            </div>    
        `
})
export class AppComponent {
    constructor(public router: Router, socketService: ClientSocketService) {

    }
}
