import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  constructor(private db: AngularFirestore) { }

  public getChatroomList() {
    return this.db.collection('chatrooms').snapshotChanges()
            .pipe(map(actions =>
              actions.map(obj => {
                const id = obj.payload.doc.id;
                const data = obj.payload.doc.data();
                return {id, ...data};
              })
            )
          );
  }

  public getChatHistory(roomID: string) {
    return this.db.collection(`chatrooms/${roomID}/chats`).snapshotChanges()
            .pipe(take(1))
            .pipe(map(actions =>
              actions.map(obj => {
                const id = obj.payload.doc.id;
                const data = obj.payload.doc.data();
                return {id, ...data};
              })
            )
          );
  }

  // status can be public/private
  public addNewChatroom(status: string, roomName: string, userList: string[], ownerID: string) {
    this.db
      .collection(`chatrooms`)
      .doc(this.db.createId())
      .set({
        status,
        members: userList,
        ownerID,
        when: new Date(),
        roomName
      })
      .then((data) => {
        console.log('new room created!');
      })
      .catch(e => {
        console.log(e);
      });

  }

  public getUpdates(chatRoomID: string): Observable<any> {
    return this.db
      .collection(`chatrooms/${chatRoomID}/chats`)
      .stateChanges(['added'])
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })),
        map(messages => messages.sort((a: any, b: any) => {
          return a.when.seconds - b.when.seconds;
        })));
  }

}
