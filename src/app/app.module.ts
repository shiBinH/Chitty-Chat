import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../chat.service';
import { MaterialModule } from './modules/material-module';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    ChatboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebase),
    AngularFireModule.initializeApp(environment.firebase, 'chitty-chat')
  ],
  exports: [
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
