import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserNotFoundError } from '../models/UserNotFoundError';
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

  /**
   * Returns a promise that resolves if a user exists with the specified email
   * @param email The email of the user
   * @returns A Promise<User> of the requested user
   */
  public getUserByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection('users').ref
      .where('email', '==', email)
      .get()
      .then((querySnapshot: QuerySnapshot<User>) => {
        if (querySnapshot.size === 0) {
          reject(new UserNotFoundError(`User with email: (${email}) does not exist`));
        } else {
          querySnapshot.forEach((userDocumentSnapshot: QueryDocumentSnapshot<User>) => {
            resolve(userDocumentSnapshot.data());
          });
        }
      });
    });
  }
}
