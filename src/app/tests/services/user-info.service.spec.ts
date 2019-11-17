import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfoService } from '../../services/user-info.service';
import { of } from 'rxjs';

let service: UserInfoService;

describe('UserInfoService.getUserList()', () => {

  const mockReturn = [{
    payload: {
      doc: {
        data() {
          return {data: 'mock data'};
        },
        id: 'mock id'
      }
    }
  }];

  const mockCollection = jasmine.createSpyObj({
    snapshotChanges: of(mockReturn)
  });

  const firestoreServiceSpy = jasmine.createSpyObj('AngularFirestore', {
    collection: mockCollection
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
        UserInfoService,
        { provide: AngularFirestore, useValue: firestoreServiceSpy }
      ],
  });
    service = TestBed.get(UserInfoService);
});

  it('calling getUserList() should return an observable', () => {

    let respond;
    service.getUserList().subscribe(res => {
      respond = res;
    });
    expect(mockCollection.snapshotChanges).toHaveBeenCalled();
    expect(firestoreServiceSpy.collection).toHaveBeenCalledWith('users');

    expect(respond[0].id).toEqual('mock id');
    expect(respond[0].data).toEqual('mock data');

  });
});

describe('UserInfoService.getCurrentUserInfo()', () => {

  const mockReturn = {
    payload: {
      id: 'mock id',
      data() {
        return 'mock data';
      }
    }
  };

  const mockDoc = jasmine.createSpyObj({
    snapshotChanges: of(mockReturn)
  });

  const firestoreServiceSpy = jasmine.createSpyObj('AngularFirestore', {
    doc: mockDoc
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
        UserInfoService,
        { provide: AngularFirestore, useValue: firestoreServiceSpy }
      ],
  });
    service = TestBed.get(UserInfoService);
});

  it('calling getCurrentUserInfo() should return an observable', () => {

    let respond;
    service.getCurrentUserInfo('mock user').subscribe(res => {
      respond = res;
    });

    expect(firestoreServiceSpy.doc).toHaveBeenCalledWith('users/mock user');
    expect(mockDoc.snapshotChanges).toHaveBeenCalled();

    expect(respond.payload.id).toEqual('mock id');
    expect(respond.payload.data()).toEqual('mock data');

    mockReturn.payload.id = 'modified id';
    expect(respond.payload.id).toEqual('modified id');
  });
});
