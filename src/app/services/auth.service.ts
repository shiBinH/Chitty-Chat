import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    user$: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            console.log( `users id is /${user.uid}`);
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      );
     }

     async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
    }

    public updateUserData(user) {
      // Sets user data to firestore on login
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
      const chatroom1: DocumentReference = this.afs.doc(`chatrooms/e0cGp5IpWGb9AuC3iuM2`).ref;
      const chatroom2: DocumentReference = this.afs.doc(`chatrooms/UgQEVNxekZrld8UJqtkZ`).ref;
      const chatroom3: DocumentReference = this.afs.doc(`chatrooms/05kbCceCnYxcfOxewCJK`).ref;
      const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        chatroomRefs: [chatroom1, chatroom2, chatroom3]
      };

      return userRef.set(data, { merge: true });

    }

    async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['/']);
    }

}
