import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../chat.service';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { filter, distinctUntilChanged, skipWhile, scan, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  text: string;
  message = '';
  messages: string[] = [];
  secretCode = 'secret';
  selectedConversation = { // this is designed this way because we might have multiple memeber in a conversation
    members: [
      {
        value: {
          user: {
            name: 'John'
          }
        }
      }
    ]
  };
  conversations = [
    {
      id: 1,
      display_name: 'Luke',
      message: ['message1']
    },
    {
      id: 2,
      display_name: 'John',
      message: ['message1']
    },
    {
      id: 3,
      display_name: 'Alex',
      message: ['message1']
    }
  ];

  friendList = [
    {
      name: 'Luke'
    },
    {
      name: 'John'
    },
    {
      name: 'Alex'
    },
  ];
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
    console.log(this.messages);
  }

  selectConversation(id: number) {
    const result = this.conversations.filter((conversation) => conversation.id === id);
    this.selectedConversation.members[0].value.user.name = result[0].display_name;
  }
  sendText(text) { console.log(this.text); }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    console.log(this.message);
    this.message = '';
    this.chatService
      .getMessages()
      .distinctUntilChanged()
      .filter((message) => message.trim().length > 0)
      .throttleTime(1000)
      .skipWhile((message) => message !== this.secretCode)
      .scan((acc: string, message: string, index: number) =>
          `${message}(${index + 1})`
        , 1)
      .subscribe((message: string) => {
        const currentTime = moment().format('hh:mm:ss a');
        const messageWithTimestamp = `${currentTime}: ${message}`;
        this.messages.push(messageWithTimestamp);
      });
  }
}
