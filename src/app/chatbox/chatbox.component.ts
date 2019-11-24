import { Component, OnInit, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
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
import {ToneAnalyzerService} from '../services/tone-analyzer.service'

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit, AfterViewChecked {
  chatroomName: string;
  userID: string;
  @Input() userInfo: User;
  selectedChatRoomID = 'UgQEVNxekZrld8UJqtkZ';
  chatroomSubscription: Subscription;
  selectedName: string;
  text: string;
  message = '';
  messages: string[] = [];
  toneWithHighestScore = 'none';
  secretCode = 'secret';
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
      text: 'mesages'
    },
    {
      from: '2',
      type: 'text',
      text: 'messages'
    }
  ];
  constructor(
    private chatService: ChatService,
    public auth: AuthService,
    public dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private messageService: MessageService,
    private userInfoService: UserInfoService,
    private chatRoomService: ChatroomService,
    private toneAnalyzerService : ToneAnalyzerService
  ) { }

  ngOnInit() {
    this.getChatroomList()
      .then(() => {
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
    this.events = [];
    this.chatroomSubscription = this.chatRoomService
      .getUpdates(this.selectedChatRoomID)
      .subscribe((message: any) => {
        console.log(message);
        message.forEach((element: Chat) => {
          this.events.push({
            from: element.user,
            type: 'text',
            text: element.content
          });
          console.log(this.events);
        });
      });
  }

  selectConversation(id: string, index: number) {
    const result = this.conversations.filter(
      conversation => conversation.id === id
    );
    this.openConversation(index);
  }

  openConversation(index: number) {
    if (this.chatroomSubscription) {
      this.chatroomSubscription.unsubscribe();
    }
    this.selectedConversation.name = this.chatroomList[index].name;
    this.selectedChatRoomID = this.chatroomList[index].id;
    this.updateChatHistory();
  }

  sendMsgToFirebase(message: string) {
    const date = new Date();
    this.messageService.sendMessage(
      this.userInfo.uid,
      date,
      this.selectedChatRoomID,
      message
    );

    this.updateToneInFirebase(this.selectedChatRoomID, localStorage.getItem('chatID'), message);
  }

  updateToneInFirebase(chatRoomID : string, chatID : string, message: string) {
    this.toneAnalyzerService.toneAnalyze(message).subscribe((res: any) => {
      let highestScore = 0.0;
      // console.log('============== Tone Analyzer response ================');
      // console.log(res);
      // console.log('============== Tone Analyzer response ================');
      if (Object.keys(res.tones).length > 0) {
        for (let i = 0; i < Object.keys(res).length; i++) {
          const obj = res.tones[i];
          if (obj.score > highestScore) {
            this.toneWithHighestScore = obj.tone_id;
            highestScore = obj.score;
          }
        }
      }
      console.log('selected tone : ',this.toneWithHighestScore);
      this.messageService.updateChatTone(this.selectedChatRoomID, chatID,this.toneWithHighestScore);

    });
  }

  sendMessage(message: string) {
    if (this.message !== '') {
      this.sendMsgToFirebase(message);
      this.message = '';
    }
  }

  scrollBottom() {
    document.getElementById('scrollMe').scrollBy(0, 50000000);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateChannelComponent, {
      width: '2000px',
      data: { userID: this.userID, chatroomName: this.chatroomName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.chatroomName = result;
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

        this.userInfoService.getUserByEmail(this.userInfo.email)
          .then((userInfo) => {
            const chatroomRefs = userInfo.chatroomRefs;
            if (chatroomRefs.length > 0) {
              chatroomRefs.forEach((item, index, arr) => {
                  item.get().then((chatroom) => {
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
}
