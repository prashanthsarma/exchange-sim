import { RouterConfig } from '@angular/router';
import { Login } from './components/Login/Login';
import { MarketMaker } from './components/Client/MarketMaker';
import { User } from './components/Client/User';

export const routes: RouterConfig = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'MarketMaker', component: MarketMaker },
  { path: 'User', component: User }
];


