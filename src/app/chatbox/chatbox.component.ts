import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { filter, distinctUntilChanged, skipWhile, scan, throttleTime, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessageService } from '../services/message.service';
import { UserInfoService } from '../services/user-info.service';
import { ChatroomService } from '../services/chatroom.service';
import { User } from '../models/user.model';
import { Chat } from '../models/chat.model';
// import randomString from 'randomstring';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  @Input() userInfo: User;
  selectedChatRoomID = 'UgQEVNxekZrld8UJqtkZ';
  text: string;
  message = '';
  messages: string[] = [];
  secretCode = 'secret';
  friendListId = [];
  conversationsListId = [];
  selectedConversation = { // this is designed this way because we might have multiple memeber in a conversation
    members: [
      {
        userID: 1,
        name: 'Luke'
      },
      {
        userID: 2,
        name: 'Alex'
      },
      {
        userID: 3,
        name: 'John'
      },
    ],
    me: {
      id: 'UgQEVNxekZrld8UJqtkZ'
    },
    conversationID: 'UgQEVNxekZrld8UJqtkZ'
  };
  conversations = [
  ];

  friendList = [
    {
      id: 1,
      name: 'Luke'
    },
    {
      id: 2,
      name: 'John'
    },
    {
      id: 3,
      name: 'Alex'
    },
  ];

  events = [
    {
      from: '1',
      type: 'text',
      text: 'mesages'
    },
    {
      from: '2',
      type: 'text',
      text: 'messages'
    },
  ];
  constructor(private chatService: ChatService,
              public auth: AuthService,
              private afAuth: AngularFireAuth,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private chatRoomService: ChatroomService) {}

  ngOnInit() {
    // this.chatService
    //   .getMessages()
    //   .subscribe((message: string) => {
    //     this.messages.push(message);
    //     this.events.push({
    //       from: '1',
    //       type: 'text',
    //       text: message
    //     });
    //   });

    this.chatRoomService
    .getUpdates(this.selectedChatRoomID)
    .subscribe((message: any) => {
      console.log(message);
      message.forEach((element: Chat) => {
        this.events.push({
        from: '1',
        type: 'text',
        text: element.content
      });
      });
      // this.events.push({
      //   from: message.user,
      //   type: 'text',
      //   text: message.content
      // });
    });
    // console.log(this.messages);

    console.log(this.userInfo);
  }


  selectConversation(id: string) {
    const result = this.conversations.filter((conversation) => conversation.id === id);
    this.selectedConversation.members[0].name = result[0].display_name;
  }

  openConversation(index: number) {
    this.selectedConversation.members[0].name = this.friendList[index].name;
    const friendIndex = this.conversations.findIndex(item => item.id === this.friendList[index].id);
    if (friendIndex !== -1) {
      return;
    } else {
    const conversation = {
        id: this.friendList[index].id,
        display_name: this.friendList[index].name,
        message: ['message1']
    };
    this.conversations.push(conversation);
  }
  }

  deleteConversation(id: string) {
    const deleteIndex = this.conversations.findIndex(item => item.id === id);
    this.conversations.splice(deleteIndex, 1);

  }
  sendMsgToFirebase(message: string) {
    const date = new Date();
    this.messageService.sendMessage(this.userInfo.uid, date, this.selectedChatRoomID, message);
  }

  sendMessage(message: string) {
    if (this.message !== '') {
    this.sendMsgToFirebase(message);
    this.message = '';
  }
}
}
