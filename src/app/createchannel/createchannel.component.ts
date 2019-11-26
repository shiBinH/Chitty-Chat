import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/models/createchat.model';
import { ChatroomService } from '../services/chatroom.service';
import { UserInfoService } from '../services/user-info.service';

@Component({
  selector: 'app-createchannel',
  templateUrl: './createchannel.component.html',
  styleUrls: ['./createchannel.component.scss']
})
export class CreateChannelComponent implements OnInit {

  constructor(
    public userService: UserInfoService,
    public chatroomService: ChatroomService,

    @Optional() public dialogRef: MatDialogRef<CreateChannelComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    roomName: string;

  ngOnInit() {}

  sendToFirebase(): void {
    if (this.roomName && this.roomName.trim().length > 0) {
      this.chatroomService.addNewChatroom('public', this.roomName, [], this.data.ownerID)
        .then((chatroomID: any) => {
          this.chatroomService.addUserToChatroom(this.data.ownerID, chatroomID)
            .then(() => {
              this.data.getChatroomList();
              this.onNoClick();
            });
        });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
