import { RouterConfig } from '@angular/router';
import { Login } from './Components/Login/Login';
import { MarketMaker } from './Components/MarketMaker/MarketMaker';

export const routes: RouterConfig = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'user', component: MarketMaker }
];


