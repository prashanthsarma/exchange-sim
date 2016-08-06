import { bootstrap }    from '@angular/platform-browser-dynamic';

import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import {routes} from './routes';
import { provideForms, disableDeprecatedForms } from '@angular/forms';


bootstrap(AppComponent, [provideForms(),
  disableDeprecatedForms(), provideRouter(routes)])
  .catch(err => console.error(err));


//bootstrap(MarketMaker).catch(function(err){ console.log(err); });

//bootstrap(AppComponent);
