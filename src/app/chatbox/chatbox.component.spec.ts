import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../modules/material-module';
import { ChatboxComponent } from './chatbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatService } from '../services/chat.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { UserInfoService } from '../services/user-info.service';
import { Observable } from 'rxjs';

describe('ChatboxComponent', () => {
  const CHATROOM1_ID = 'chatroomID1';
  const CHATROOM1_NAME = 'chatroomName1';
  const CHATROOM2_ID = 'chatroomID2';
  const CHATROOM2_NAME = 'chatroomName2';
  const NON_EMPTY_USER_CHATROOM_OBSERVABLE: Observable<any> = new Observable((subscriber) => {
    subscriber.next({
      payload: {
        data() {
          return {
            chatroomRefs: [
              createChatroomDocumentRef(CHATROOM1_ID, CHATROOM1_NAME),
              createChatroomDocumentRef(CHATROOM2_ID, CHATROOM2_NAME)]
          };
        }
      }
    });
  });
  const EMPTY_USER_CHATROOM_OBSERVABLE: Observable<any> = new Observable((subscriber) => {
    subscriber.next({
      payload: {data() {return {chatroomRefs: []}; }}
    });
  });

  let componentUnderTest: ChatboxComponent;
  let fixture: ComponentFixture<ChatboxComponent>;
  let userInfoServiceSpy: jasmine.SpyObj<UserInfoService>;

  userInfoServiceSpy = jasmine.createSpyObj('UserInfoService', ['getCurrentUserInfo']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        MaterialModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule
      ],
      declarations: [ChatboxComponent],
      providers: [ChatService, AuthService, AngularFireAuth, AngularFirestore,
        { provide: UserInfoService, useValue: userInfoServiceSpy}],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatboxComponent);
    componentUnderTest = fixture.componentInstance;
    componentUnderTest.userInfo = {
      uid: 'uid',
      email: 'email',
      friendList: ['friendID1', 'friendID2'],
      chatrooms: ['chatroomID1', 'chatroomID2']
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  it('calling getChatroomList() SHOULD retrieve chatroomList IF user has chatrooms', () => {
    userInfoServiceSpy
      .getCurrentUserInfo.withArgs(jasmine.any(String))
      .and.returnValue(NON_EMPTY_USER_CHATROOM_OBSERVABLE);
    componentUnderTest.getChatroomList().then(() => {
      expect(componentUnderTest.chatroomList)
        .toEqual([{id: CHATROOM1_ID, name: CHATROOM1_NAME}, {id: CHATROOM2_ID, name: CHATROOM2_NAME}]);
    }).catch();
  });

  it('calling getChatroomList() SHOULD resolve IF user has no chatrooms', () => {
    userInfoServiceSpy
      .getCurrentUserInfo.withArgs(jasmine.any(String))
      .and.returnValue(EMPTY_USER_CHATROOM_OBSERVABLE);
    componentUnderTest.getChatroomList().catch((err) => {
      expect(err).toEqual(jasmine.any(Error));
    });
  });

  function createChatroomDocumentRef(id: string, roomName: string) {
    return {
      id,
      get() {
        return new Promise((resolve, reject) => {
          resolve({
            data() {
              return {roomName};
            }
          });
        });
      }
    };
  }
});
