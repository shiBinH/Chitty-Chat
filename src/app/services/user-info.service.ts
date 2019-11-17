import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private db: AngularFirestore) { }

  // will return an observable object
  // use subscribe to achieve data
  public getUserList() {
    return this.db.collection('users').snapshotChanges()
            .pipe(map(actions =>
              actions.map(obj => {
                const id = obj.payload.doc.id;
                const data = obj.payload.doc.data();
                return {id, ...data};
              })
            )
          );
  }

  // use respond.payload.data() to achieve metadata
  // and respond.payload.id to achieve id
  public getCurrentUserInfo(userID: string) {
    return this.db.doc(`users/${userID}`).snapshotChanges();
  }
}
