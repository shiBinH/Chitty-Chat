import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take} from 'rxjs/operators';
import { firestore } from 'firebase';
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
  public addNewChatroom(status: string, roomName: string, userList: string[], ownerID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ROOMID = this.db.createId();
      this.db
      .collection(`chatrooms`)
      .doc(ROOMID)
      .set({
        status,
        members: userList,
        ownerID,
        when: new Date(),
        roomName
      })
      .then(() => {
        return resolve(ROOMID);
      })
      .catch(error => {
        return reject(error);
      });
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

  /**
   * @summary Adds chatroom to a user's chatroomsRefs property
   *          and adds the user to the chatroom's members property
   * @param userID The ID of the user
   * @param chatroomID The ID of the chatroom
   * @returns Promise that resolves if both add operations are successful
   */
  public addUserToChatroom(userID: string, chatroomID: string): Promise<any> {

    const batch = this.db.firestore.batch();

    batch.update(this.db.doc(`chatrooms/${chatroomID}`).ref, {
      members: firestore.FieldValue.arrayUnion(userID)
    });

    batch.update(this.db.doc(`users/${userID}`).ref, {
      chatroomRefs: firestore.FieldValue.arrayUnion(
        this.db.doc(`chatrooms/${chatroomID}`).ref)
    });

    return batch.commit();
  }

}
