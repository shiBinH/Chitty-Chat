import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CreateChannelComponent } from './createchannel.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../modules/material-module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChatboxComponent } from '../chatbox/chatbox.component';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { ChatroomService } from '../services/chatroom.service';

describe('CreateChannelComponent', () => {
  let component: CreateChannelComponent;
  let fixture: ComponentFixture<CreateChannelComponent>;
  let chatroomServiceSpy: jasmine.SpyObj<ChatroomService>;

  describe('CreateChannelComponent', () => {
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    // let mockData = {
    //   getChatroomList: () => 'mock function',
    //   ownerID: 'mock owner'
    // };
    const mockData = jasmine.createSpyObj(
      'data', ['getChatroomList', 'ownerID']
    );
    chatroomServiceSpy = jasmine.createSpyObj(
      'ChatroomService', ['addNewChatroom', 'addUserToChatroom']
    );
    chatroomServiceSpy.addNewChatroom.and.returnValue(Promise.resolve('mock chatroom id'));
    chatroomServiceSpy.addUserToChatroom.and.returnValue(Promise.resolve());
    mockData.ownerID = 'mock owner';
    mockData.getChatroomList.and.returnValue('mock function');

    beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        MaterialModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      declarations: [ CreateChannelComponent, ChatboxComponent ],
      providers: [
        ChatService, AuthService, AngularFireAuth, AngularFirestore,
        { provide: MatDialogRef,
          useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA,
          useValue: mockData
        },
        { provide: ChatroomService, useValue: chatroomServiceSpy},
      ]
    })
    .compileComponents();
  }));

    beforeEach(() => {
    fixture = TestBed.createComponent(CreateChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('should create', () => {
    expect(component).toBeTruthy();
    });

    it('#onNoClick should close the dialog', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('sendToFirebase() should add new chatroom', fakeAsync(() => {
      component.roomName = 'mock room name';
      spyOn(component, 'onNoClick');
      component.sendToFirebase();
      tick();

      expect(component.onNoClick).toHaveBeenCalled();
      expect(chatroomServiceSpy.addNewChatroom).toHaveBeenCalled();
      expect(chatroomServiceSpy.addUserToChatroom).toHaveBeenCalled();
      expect(mockData.getChatroomList).toHaveBeenCalled();
    }));

    it('should render correct UI for dialog', () => {
      const compiled = fixture.debugElement.nativeElement;
      const dialogTitle = compiled.querySelector('h1');
      expect(dialogTitle.textContent).toEqual('Say hello...');

      const dialogContent = compiled.querySelectorAll('p');
      expect(dialogContent[0].textContent).toEqual('Who do you want to chat with today?');
      expect(dialogContent[1].textContent).toEqual('Create Chatroom Name');

      const dialogButtom = compiled.querySelectorAll('button');
      expect(dialogButtom[0].textContent).toEqual('Exit');
      expect(dialogButtom[1].textContent).toEqual('Start Chatting!');
    });

    it('should bind user input to roomName', () => {
      const compiled = fixture.debugElement.nativeElement;
      const userInput = compiled.querySelector('input');

      userInput.value = 'mock room name';
      fixture.detectChanges();
      userInput.dispatchEvent(new Event('input'));
      expect(component.roomName).toEqual('mock room name');
    });
  });
});
