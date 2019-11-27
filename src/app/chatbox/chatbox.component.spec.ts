import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../modules/material-module';
import { ChatboxComponent } from './chatbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { UserInfoService } from '../services/user-info.service';
import { ChatroomService } from '../services/chatroom.service';
import { Subscription } from 'rxjs';

describe('ChatboxComponent', () => {
  const INVALID_EMAIL = '  ';
  const VALID_EMAIL_REGISTERED = 'Registered@gmail.com';
  const CHATROOM1_ID = 'chatroomID1';
  const CHATROOM1_NAME = 'chatroomName1';
  const CHATROOM2_ID = 'chatroomID2';
  const CHATROOM2_NAME = 'chatroomName2';
  const RESOLVED_PROMISE_WITH_CHATROOMS: Promise<any> = Promise.resolve({
    chatroomRefs: [
      createChatroomDocumentRef(CHATROOM1_ID, CHATROOM1_NAME),
      createChatroomDocumentRef(CHATROOM2_ID, CHATROOM2_NAME)]
  });
  const RESOLVED_PROMISE_WITH_NO_CHATROOMS: Promise<any> = Promise.resolve({
    chatroomRefs: []
  });
  const REJECTED_PROMISE_EMAIL_NOT_FOUND: Promise<any> = Promise.reject();
  const USER_INFO = {
    uid: 'userID'
  };
  const SELECTED_CHATROOM_ID = 'selectedChatroomID';

  let componentUnderTest: ChatboxComponent;
  let fixture: ComponentFixture<ChatboxComponent>;
  let userInfoServiceSpy: jasmine.SpyObj<UserInfoService>;
  let chatroomServiceSpy: jasmine.SpyObj<ChatroomService>;
  let mockSubscription: jasmine.SpyObj<Subscription>;
  let mockObject: jasmine.SpyObj<any>;

  userInfoServiceSpy = jasmine.createSpyObj(
    'UserInfoService',
    ['getUserByEmail', 'getUserList']);
  chatroomServiceSpy = jasmine.createSpyObj(
    'ChatroomService',
    ['addUserToChatroom']);
  mockSubscription = jasmine.createSpyObj(
    'MockSubscription',
    ['unsubscribe']);
  mockObject = jasmine.createSpyObj(
    'MockObject',
    ['subscribe']);

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
      providers: [AuthService, AngularFireAuth, AngularFirestore,
        { provide: UserInfoService, useValue: userInfoServiceSpy},
        { provide: ChatroomService, useValue: chatroomServiceSpy}],
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_CHATROOMS);
    TestBed.get(UserInfoService)
      .getUserList.withArgs(jasmine.any(String))
      .and.returnValue(mockObject);

    fixture = TestBed.createComponent(ChatboxComponent);
    componentUnderTest = fixture.componentInstance;
    componentUnderTest.userInfo = {
      uid: 'uid',
      email: 'email',
      friendList: ['friendID1', 'friendID2'],
      chatrooms: ['chatroomID1', 'chatroomID2']
    };
    componentUnderTest.selectedChatRoomID = SELECTED_CHATROOM_ID;
    componentUnderTest.userListSubscription = mockSubscription;
    fixture.detectChanges();
  });

  it('should create', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_CHATROOMS);
    componentUnderTest.ngOnInit();
  });

  it('calling getChatroomList() SHOULD retrieve chatroomList IF user has chatrooms', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_CHATROOMS);
    componentUnderTest.getChatroomList().then(() => {
      expect(componentUnderTest.chatroomList)
        .toEqual([{id: CHATROOM1_ID, name: CHATROOM1_NAME}, {id: CHATROOM2_ID, name: CHATROOM2_NAME}]);

    }).catch();
  });

  it('calling getChatroomList() SHOULD reject IF user has no chatrooms', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(RESOLVED_PROMISE_WITH_NO_CHATROOMS);
    componentUnderTest.getChatroomList().catch((e) => {
      expect(e).toEqual(jasmine.any(Error));

    });
  });

  it('calling getChatroomList() SHOULD reject IF email does not exist', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(REJECTED_PROMISE_EMAIL_NOT_FOUND);
    componentUnderTest.getChatroomList().catch((e) => {
      expect(e).toEqual(jasmine.any(Error));

    });
  });

  it('calling addUserByEmail() SHOULD reject IF email is invalid', () => {
    componentUnderTest.addUserByEmail(INVALID_EMAIL).catch((e) => {
      expect(e).toBeUndefined();
    });
  });

  it('calling addUserByEmail() SHOULD resolve IF email exists', () => {
    TestBed.get(UserInfoService)
      .getUserByEmail.withArgs(jasmine.any(String))
      .and.returnValue(Promise.resolve(USER_INFO));
    TestBed.get(ChatroomService)
      .addUserToChatroom.withArgs(jasmine.any(String), jasmine.any(String))
      .and.returnValue(Promise.resolve());
    spyOn(componentUnderTest, 'updateUserList');
    componentUnderTest.addUserByEmail(VALID_EMAIL_REGISTERED).then(() => {
      expect(userInfoServiceSpy.getUserByEmail).toHaveBeenCalled();
      expect(chatroomServiceSpy.addUserToChatroom).toHaveBeenCalled();
      expect(componentUnderTest.updateUserList).toHaveBeenCalled();
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
