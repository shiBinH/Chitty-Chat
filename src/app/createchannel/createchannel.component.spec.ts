import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannelComponent } from './createchannel.component';
import { NgModule } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../modules/material-module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChatboxComponent } from '../chatbox/chatbox.component';

describe('CreateChannelComponent', () => {
  let component: CreateChannelComponent;
  let fixture: ComponentFixture<CreateChannelComponent>;

  describe('CreateChannelComponent', () => {
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    const mockData = {
      chatroomName: 'mock name',
      userID: 'mock user'
    };

    beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        MaterialModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      declarations: [ CreateChannelComponent, ChatboxComponent ],
      providers: [
        { provide: MatDialogRef,
          useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA,
          useValue: { mockData }
        }
      ]
    })
    .compileComponents();
  }));

    beforeEach(() => {
    fixture = TestBed.createComponent(CreateChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


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
  });
});
