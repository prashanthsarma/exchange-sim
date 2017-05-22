import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { routing } from './routes';
import { HttpModule } from '@angular/http';
import {ClientSocketService} from './ClientSocketService';
import {LoginService} from './LoginService';
import {MarketMakerAIService} from './MarketMakerAIService';
import {ConfigService} from './ConfigService';
import {DataTableModule, ButtonModule, DropdownModule, CarouselModule, SpinnerModule, InputTextModule} from 'primeng/primeng';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Login } from './components/Login/Login';
import { MarketMaker } from './components/Client/MarketMaker';
import { User } from './components/Client/User';
import { Home } from './components/Client/Home';
import { Position } from './components/Client/Position';


@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule, routing, FormsModule, HttpModule, DataTableModule, ButtonModule,DropdownModule, CarouselModule, SpinnerModule, InputTextModule],
  declarations: [ AppComponent, Login, MarketMaker, User, Home, Position],
  bootstrap: [ AppComponent ],
  providers: [ClientSocketService, ConfigService, LoginService, MarketMakerAIService]
})
export class AppModule { }
