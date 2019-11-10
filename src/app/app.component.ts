import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chitty-chat';
  message = '';
  messages: string[] = [];
  constructor(private chatService: ChatService, db: AngularFirestore, public router: Router) {}

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
    this.router.navigate(['/chatbox']);
  }

  printError(event) {
      console.error(event);
  }
}
