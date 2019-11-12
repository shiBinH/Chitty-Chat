import { TestBed } from '@angular/core/testing';

import { MessageService } from '../../services/message.service';
import { AngularFirestore } from '@angular/fire/firestore';

//  test suite
describe('MessageService', () => {
  //  initialize here
  let serviceUnderTest: MessageService;
  let mockObject: jasmine.SpyObj<any>;
  let firestoreServiceSpy: any;
  const userID = 'userID';
  const when: Date = new Date(); //  this should be probably be fixed
  const chatRoomID = 'chatRoomID';
  const content = 'Message content text';
  const tone = 'angry';

  //  setup before each test
  beforeEach(() => {
    //  create mock object and its methods
    mockObject = jasmine.createSpyObj(
      'MockReturnObject',
      ['collection', 'doc', 'set', 'then']);
    //  stub calls to return mock object
    mockObject.doc.and.returnValue(mockObject);
    mockObject.set.and.returnValue(mockObject);
    mockObject.then.and.returnValue(mockObject);

    //  create firestore service spy
    firestoreServiceSpy = jasmine.createSpyObj(
      'FirestoreService',
      ['collection', 'createId']);
    firestoreServiceSpy
      .collection.and.callFake(() => mockObject);

    TestBed.configureTestingModule({
      providers: [
        MessageService, //  the service under test
        { provide: AngularFirestore, useValue: firestoreServiceSpy} //  mock service
      ]
    });

  });

  //  a unit test
  it('sendMessage() SHOULD return IF valid input ', () => {
    serviceUnderTest = TestBed.get(MessageService);
    serviceUnderTest.sendMessage(userID, when, chatRoomID, content, tone);

    //  checking if calls were made since get
    expect(firestoreServiceSpy.collection).toHaveBeenCalled();
    expect(mockObject.doc).toHaveBeenCalled();
    expect(mockObject.set).toHaveBeenCalled();
    expect(mockObject.then).toHaveBeenCalled();
  });

});
