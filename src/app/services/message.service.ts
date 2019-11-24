import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private db: AngularFirestore) { }

  public sendMessage(
    userID: string, when: Date, chatRoomID: string,
    content: string, tone: string = 'angry'): void {
    console.log(`Sending message for userID: ${userID}, when: ${when},
                chatRoomID: ${chatRoomID}, content: ${content}, emotion: ${tone}`);
    const chatID = this.db.createId();
    localStorage.setItem('chatID', chatID);
    this.db
      .collection(`chatrooms/${chatRoomID}/chats`)
      .doc(chatID)
      .set({
        content,
        emotion: tone,
        tone_id: tone,
        user: userID,
        when
      })
      .then((data) => {
        console.log('Message successfully sent!');
      });
  }



}
