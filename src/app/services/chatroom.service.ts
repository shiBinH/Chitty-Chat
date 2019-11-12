import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.db.collection('chatrooms/' + roomID + '/chats').snapshotChanges()
            .pipe(map(actions =>
              actions.map(obj => {
                const id = obj.payload.doc.id;
                const data = obj.payload.doc.data();
                return {id, ...data};
              })
            )
          );
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
        })));
  }
}
