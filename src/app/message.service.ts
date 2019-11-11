import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private db : AngularFirestore) { }

  public sendMessage(
    userID: String, when: Date, chatRoomID: String, content: String, tone: String = "angry") : void {
    console.log(`Sending message for userID: ${userID}, when: ${when},
                chatRoomID: ${chatRoomID}, content: ${content}, emotion: ${tone}`)
    this.db
      .collection(`chatrooms/${chatRoomID}/chats`)
      .doc(this.db.createId())
      .set({
        content,
        emotion: tone,
        tone_id: tone,
        user: userID,
        when: when
      })
      .then((data) => {
        console.log('Message successfully sent!')
      })
  }

}
