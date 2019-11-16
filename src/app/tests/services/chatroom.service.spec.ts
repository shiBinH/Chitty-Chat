import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatroomService } from '../../services/chatroom.service';
import { Observable } from 'rxjs';

describe('ChatroomService.getUpdates()', () => {
  const CHATROOM_ID = 'chatroomID';
  const COLLECTION_PATH = `chatrooms/${CHATROOM_ID}/chats`;
  const STATE_CHANGES = ['added'];
  const obs = new Observable((subscriber) => {
    subscriber.next([createMessageWithSeconds(10), createMessageWithSeconds(5)]);
  });

  let serviceUnderTest: ChatroomService;
  let firestoreServiceSpy: jasmine.SpyObj<AngularFirestore>;
  let mockCollection: jasmine.SpyObj<any>;

  firestoreServiceSpy = jasmine.createSpyObj('FirestoreService', ['collection']);
  mockCollection = jasmine.createSpyObj('MockCollection', ['stateChanges']);

  firestoreServiceSpy
    .collection.withArgs(jasmine.any(String))
    .and.returnValue(mockCollection);
  mockCollection
    .stateChanges.withArgs(jasmine.any(Array))
    .and.returnValue(obs);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          ChatroomService,
          { provide: AngularFirestore, useValue: firestoreServiceSpy }
      ]
    });
  });

  it('getUpdates() SHOULD return messages sorted by timestamp IF valid input', () => {
    serviceUnderTest = TestBed.get(ChatroomService);
    serviceUnderTest.getUpdates(CHATROOM_ID).subscribe({
      next(msg) {
        expect(msg[0].when.seconds < msg[1].when.seconds);
      }
    });
    expect(firestoreServiceSpy.collection).toHaveBeenCalledWith(COLLECTION_PATH);
    expect(mockCollection.stateChanges).toHaveBeenCalledWith(STATE_CHANGES);
  });

  function createMessageWithSeconds(seconds: number) {
    return {
      payload: {
        doc: {
          data() {
            return {
              content: 'sample content',
              when: {seconds}
            };
          },
          id: 'messageID'
        }
      }
    };
  }

});
