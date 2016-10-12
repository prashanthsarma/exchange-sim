import { AppComponent } from './app.component';
import {routing} from './routes';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {ClientSocketService} from './ClientSocketService';
import {LoginService} from './LoginService';
import {MarketMakerAIService} from './MarketMakerAIService';
import {ConfigService} from './ConfigService';
import {DataTable, Column, Button, Dropdown, Carousel, Spinner, InputText} from 'primeng/primeng';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [ BrowserModule, routing, FormsModule, HttpModule],
  declarations: [ AppComponent, DataTable, Column, Button, Dropdown, InputText, Carousel, Spinner],
  bootstrap: [ AppComponent ],
  providers: [ClientSocketService, ConfigService, LoginService, MarketMakerAIService]
})
export class AppModule { }
