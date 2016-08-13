import { ActivatedRoute, Router, ROUTER_DIRECTIVES } from '@angular/router';
import { Component } from '@angular/core';
import {LoginService} from './../../LoginService';

@Component({
  selector: 'Home',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: './app/components/Client/Home.html',
})
export class Home {
  userType: string;
  userTypeRoute: string;
  constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
    this.userType = this.loginService.UserType;
    //this.router.navigate(['../', this.userType], {relativeTo: this.route});
  }
}
