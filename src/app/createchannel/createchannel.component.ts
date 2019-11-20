import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/models/createchat.model';

@Component({
  selector: 'app-createchannel',
  templateUrl: './createchannel.component.html',
  styleUrls: ['./createchannel.component.scss']
})
export class CreateChannelComponent implements OnInit {


  constructor(
    @Optional() public dialogRef: MatDialogRef<CreateChannelComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    ngOnInit() {
   }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
