import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

describe('AuthService', () => {
  const mockCredential = [{
    user:
    {
    uid: 'mock uid',
    email: 'mock email',
    displayName: 'mock name',
    photoURL: 'mock photo',
    friendList: 'mock friend list',
    chatrooms: 'mock chatrooms'
    }
  }];

  let routerSpy: jasmine.SpyObj<any>;
  let mockAuth: jasmine.SpyObj<any>;
  let serviceUnderTest: AuthService;
  let firestoreServiceSpy: jasmine.SpyObj<any>;
  let angularFireAuthSpy: jasmine.SpyObj<any>;
  let mockDocument: jasmine.SpyObj<any>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj(
      'routerSpy',
      ['navigate']
    );
    routerSpy.navigate.and.returnValue(routerSpy);

    angularFireAuthSpy = jasmine.createSpyObj(
      'AngularFireAuthSpy',
      ['auth', 'authState']);
    mockAuth = jasmine.createSpyObj(
      'authSpy',
      ['signInWithPopup', 'signOut']);
    firestoreServiceSpy = jasmine.createSpyObj(
      'FirestoreSpy',
      ['doc']);

    mockDocument = jasmine.createSpyObj(
      'firebaseDocSpy',
      ['set', 'valueChanges']
    );

    angularFireAuthSpy.auth = mockAuth;
    mockAuth.signInWithPopup.and.returnValue(mockCredential[0]);

    firestoreServiceSpy.doc.and.returnValue(mockDocument);

    angularFireAuthSpy.authState = new Observable((subscriber) => subscriber.next(mockCredential[0].user));
    mockDocument.valueChanges.and.returnValue(new Observable((subscriber) => subscriber.next(mockCredential[0].user)));

    TestBed.configureTestingModule({
    providers: [
      AuthService,
      { provide: Router, useValue: routerSpy},
      { provide: AngularFirestore, useValue: firestoreServiceSpy },
      { provide: AngularFireAuth, useValue: angularFireAuthSpy }
    ]
  });

});

  it('googleSignin() should update user info to firestore', () => {

    serviceUnderTest = TestBed.get(AuthService);
    spyOn(serviceUnderTest, 'updateUserData');

    serviceUnderTest.googleSignin().then(() => {
      expect(serviceUnderTest.updateUserData).toHaveBeenCalled();
      expect(firestoreServiceSpy.doc).toHaveBeenCalled();
      expect(mockDocument.set).toHaveBeenCalled();
    });

    expect(mockAuth.signInWithPopup).toHaveBeenCalled();
  });

  it('user$ should return user info if there is an user signed in', () => {
    serviceUnderTest = TestBed.get(AuthService);

    serviceUnderTest.user$.subscribe(res => {
      expect(res.uid).toEqual('mock uid');
    });
    expect(firestoreServiceSpy.doc).toHaveBeenCalled();
    expect(mockDocument.valueChanges).toHaveBeenCalled();
  });

  it('user$ should return null if no user signed in', () => {
    angularFireAuthSpy.authState = new Observable();
    serviceUnderTest = TestBed.get(AuthService);

    serviceUnderTest.user$.subscribe(res => {
      expect(res).toEqual(null);
    });
  });

  it('signOut() should redirect router', fakeAsync(() => {
    serviceUnderTest = TestBed.get(AuthService);

    serviceUnderTest.signOut();
    expect(mockAuth.signOut).toHaveBeenCalled();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));
});
