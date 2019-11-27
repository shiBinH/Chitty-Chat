import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessageService } from '../services/message.service';
import { UserInfoService } from '../services/user-info.service';
import { ChatroomService } from '../services/chatroom.service';
import { User } from '../models/user.model';
import { Chat } from '../models/chat.model';
import { DialogData } from 'src/app/models/createchat.model';
import { UserInfo } from 'firebase';
import { Chatuser } from '../models/chatuser.model';
import { CreateChannelComponent } from '../createchannel/createchannel.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {ToneAnalyzerService} from '../services/tone-analyzer.service';
import { isNull } from 'util';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit, AfterViewChecked {
  @Input() userInfo: User;
  selectedChatRoomID = 'UgQEVNxekZrld8UJqtkZ';
  chatroomSubscription: Subscription;
  userListSubscription: Subscription;
  selectedName: string;
  text: string;
  message = '';
  messages: string[] = [];
  toneWithHighestScore = 'none';
  secretCode = 'secret';
  friendListId = [];
  roomName: string;
  isActive = false;
  inputtedEmail: '';
  validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source
    + /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source;

  conversationsListId = [
    '05kbCceCnYxcfOxewCJK',
    'UgQEVNxekZrld8UJqtkZ',
    'e0cGp5IpWGb9AuC3iuM2',
    'ji9ldKigbHxBadcZyb1E'
  ];
  selectedConversation = {
    name: ''
  };
  conversations = [];

  //  Stores all available chatrooms to the user
  chatroomList = [];

  events = [
    {
      from: '1',
      type: 'text',
      text: 'mesages',
      tone_id: 'empty'
    },
    {
      from: '2',
      type: 'text',
      text: 'messages',
      tone_id: 'empty'
    }
  ];
  userListEvents = [
    {
      uid: '1',
      type: 'text',
      displayName: 'mesages',
      email: 'example@email.com'
    },
    {
      uid: '2',
      type: 'text',
      displayName: 'messages',
      email: 'example@email.com'
    }
  ];
  constructor(
    public auth: AuthService,
    public dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private messageService: MessageService,
    private userInfoService: UserInfoService,
    private chatRoomService: ChatroomService,
    private toneAnalyzerService: ToneAnalyzerService
  ) {}

  ngOnInit() {
    this.getChatroomList().then(() => {
      if (this.chatroomList.length) {
        this.openConversation(0);
      }
    });
    console.log(this.userInfo);
  }

  ngAfterViewChecked(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.scrollBottom();
  }

  updateChatHistory() {
    if (this.chatroomSubscription) {
      this.chatroomSubscription.unsubscribe();
    }
    this.events = [];
    this.chatroomSubscription = this.chatRoomService
      .getUpdates(this.selectedChatRoomID)
      .subscribe((message: any) => {
        message.forEach((element: Chat) => {
          this.events.push({
            from: element.user,
            type: 'text',
            text: element.content,
            tone_id: element.tone_id
          });
        });
      });
  }

  updateEmoji(toneId: string) {
    switch (toneId) {
      case 'anger':
        return '&#128545;';
      case 'fear':
        return '&#128552;';
      case 'joy':
        return '&#128516;';
      case 'sadness':
        return '&#128546;';
      case 'confident':
        return '&#128526;';
      case 'tentative':
        return '&#128533;';
      case 'empty':
        return '&#128526;';
    }
  }

  selectConversation(id: string, index: number) {
    const result = this.conversations.filter(
      conversation => conversation.id === id
    );
    this.openConversation(index);
  }

  openConversation(index: number) {
    this.selectedConversation.name = this.chatroomList[index].name;
    this.selectedChatRoomID = this.chatroomList[index].id;
    this.updateChatHistory();
    this.updateUserList();
    this.isActive = !this.isActive;
  }

  updateToneInFirebase(chatRoomID: string, message: string) {
    this.toneAnalyzerService.toneAnalyze(message).subscribe((res: any) => {
      let highestScore = 0.0;
      if (Object.keys(res.tones).length > 0) {
        for (let i = 0; i < Object.keys(res).length; i++) {
          const obj = res.tones[i];
          if (obj.score > highestScore) {
            this.toneWithHighestScore = obj.tone_id;
            highestScore = obj.score;
          }
        }
      }
      const date = new Date();
      this.messageService.sendMessage(
        this.userInfo.uid,
        date,
        this.selectedChatRoomID,
        message,
        this.toneWithHighestScore
      );
      console.log('selected tone : ', this.toneWithHighestScore);
    });
  }

  sendMessage(message: string) {
    if (this.message !== '') {
      this.updateToneInFirebase(this.selectedChatRoomID, message);
      this.message = '';
    }
  }

  scrollBottom() {
    document.getElementById('scrollMe').scrollBy(0, 50000000);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateChannelComponent, {
      width: '2000px',
      data: {
        ownerID: this.userInfo.uid,
        getChatroomList: this.getChatroomList.bind(this)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.roomName = result;
      console.log(result);
    });
  }
  /**
   * @summary Updates the component's chatroomList property
   *          with the user's chatrooms
   * @returns A Promise that resolves if the component's
   *          chatroomList property successfully updates
   */
  getChatroomList(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.chatroomList = [];
      const availableChatrooms = this.chatroomList;
      this.userInfoService
        .getUserByEmail(this.userInfo.email)
        .then(userInfo => {
          const chatroomRefs = userInfo.chatroomRefs;
          if (chatroomRefs.length > 0) {
            chatroomRefs.forEach((item, index, arr) => {
              item.get().then(chatroom => {
                const chatroomData = chatroom.data();
                availableChatrooms.push({
                  id: item.id,
                  name: chatroomData.roomName
                });

                if (index === arr.length - 1) {
                  resolve();
                }
              });
            });
          } else {
            reject(new Error('No user chatrooms found'));
          }
        })
      .catch(() => {
        reject(new Error('User not found'));
      });
    });
  }

  /**
   * @summary Adds user with email to chatroom with id Chatbox.component.selectedChatroomID
   * @param email Email address of user to add
   * @returns Promise that resolves if the email exists and user is successfully added
   */
  addUserByEmail(email: string): Promise<any> {
    if (email && this.validateEmail(email)) {
      return this.userInfoService.getUserByEmail(email)
        .then((userInfo: any) => {
          this.chatRoomService.addUserToChatroom(userInfo.uid, this.selectedChatRoomID)
            .then(() => {
              this.inputtedEmail = '';
              this.updateUserList();
            });
        });
    } else {
      return Promise.reject();
    }
  }

  /**
   * @summary Updates the component's userListEvents
   *          with the users in the current chatrooms
   * @todo Unit test
   */
  updateUserList() {
    this.inputtedEmail = '';
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
    this.userListSubscription = this.userInfoService
      .getUserList()
      .subscribe((message: any) => {
        this.userListEvents = [];
        message.forEach((element: any) => {
          element.chatroomRefs.forEach((chatRef: any) => {
            if (chatRef.id === this.selectedChatRoomID) {
              this.userListEvents.push({
                uid: element.uid,
                type: 'text',
                displayName: element.displayName,
                email: element.email
              });
            }
          });
        });
      });
  }

  private validateEmail(email: string): boolean {
    return !isNull(email.match(this.validEmailRegex));
  }

}
