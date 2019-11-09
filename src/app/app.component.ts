import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
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
  constructor(private chatService: ChatService, db: AngularFirestore) {}

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

  printUser(event) {
    console.log(event);
  }

  printError(event) {
      console.error(event);
  }
}
