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

describe('ChatboxComponent', () => {
  const CHATROOM1_ID = 'chatroomID1';
  const CHATROOM1_NAME = 'chatroomName1';
  const CHATROOM2_ID = 'chatroomID2';
  const CHATROOM2_NAME = 'chatroomName2';
  const RESOLVED_PROMISE_WITH_CHATROOMS: Promise<any> = Promise.resolve({
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
  const RESOLVED_PROMISE_WITH_NO_CHATROOMS: Promise<any> = Promise.resolve({
    payload: {data() {return {chatroomRefs: []}; }}
  });
  const REJECTED_PROMISE_EMAIL_NOT_FOUND: Promise<any> = Promise.reject();

  let componentUnderTest: ChatboxComponent;
  let fixture: ComponentFixture<ChatboxComponent>;
  let userInfoServiceSpy: jasmine.SpyObj<UserInfoService>;

  userInfoServiceSpy = jasmine.createSpyObj('UserInfoService', ['getUserByEmail']);

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
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_CHATROOMS);
    componentUnderTest.getChatroomList().then(() => {
      expect(componentUnderTest.chatroomList)
        .toEqual([{id: CHATROOM1_ID, name: CHATROOM1_NAME}, {id: CHATROOM2_ID, name: CHATROOM2_NAME}]);
    }).catch();
  });

  it('calling getChatroomList() SHOULD reject IF user has no chatrooms', () => {
    userInfoServiceSpy
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_NO_CHATROOMS);
    componentUnderTest.getChatroomList().catch((e) => {
      expect(e).toEqual(jasmine.any(Error));
    });
  });

  it('calling getChatroomList() SHOULD reject IF email does not exist', () => {
    userInfoServiceSpy
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(REJECTED_PROMISE_EMAIL_NOT_FOUND);
    componentUnderTest.getChatroomList().catch((e) => {
      expect(e).toEqual(jasmine.any(Error));
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
