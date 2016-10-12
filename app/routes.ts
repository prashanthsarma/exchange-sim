import { Routes, RouterModule } from '@angular/router';
import { Login } from './components/Login/Login';
import { MarketMaker } from './components/Client/MarketMaker';
import { User } from './components/Client/User';
import { Home } from './components/Client/Home';
import { Position } from './components/Client/Position';

const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  {
    path: 'Home', component: Home,
    children: [
      { path: 'MarketMaker', component: MarketMaker },
      { path: 'User', component: User },
      { path: 'Positions', component: Position }]
  },
];

export const routing = RouterModule.forRoot(routes);

