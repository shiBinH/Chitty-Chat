import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

  public addNewChatroom(status: string, roomName: string, userList: string[], ownerID: string){
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
      .catch(e =>{
        console.log(e);
      });
  }
}
