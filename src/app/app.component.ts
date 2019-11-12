import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import { AuthService } from './services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chitty-chat';
  message = '';
  messages: string[] = [];
  constructor(db: AngularFirestore, private chatService: ChatService, public auth: AuthService) {}

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
    console.log(this.messages);
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

}
