import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfoService } from '../../services/user-info.service';
import { of } from 'rxjs';

let service: UserInfoService;

// mock return
const userListRes = {
  id: 'mock id',
  data: 'mock data'
};

// mock snapshotChanges for mock collection
const userCollectionSpy = jasmine.createSpyObj({
  snapshotChanges: of(userListRes)
});

// mock collection for AngularFirestore
const userListFuncspy = jasmine.createSpyObj('AngularFirestore', {
  collection: userCollectionSpy
});

describe('UserInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
        UserInfoService,
        { provide: AngularFirestore, useValue: userListFuncspy }
      ],
  });
    service = TestBed.get(UserInfoService);
});

  it('calling getUserList() should call a firestore collection and snapshotChanges', () => {

    service.getUserList();

    expect(userCollectionSpy.snapshotChanges).toHaveBeenCalled();
    expect(userListFuncspy.collection).toHaveBeenCalledWith('users');
  });
});



const currentUserRes = {
  name: 'mock name',
  data: 'mock data'
};

const userDocSpy = jasmine.createSpyObj({
  snapshotChanges: of(currentUserRes)
});

const currentUserFuncspy = jasmine.createSpyObj('AngularFirestore', {
  doc: userDocSpy
});

describe('UserInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
        UserInfoService,
        { provide: AngularFirestore, useValue: currentUserFuncspy }
      ],
  });
    service = TestBed.get(UserInfoService);
});

  it('calling getCurrentUserInfo() should return an observable', () => {

    let ret;
    service.getCurrentUserInfo('mock user').subscribe(res => {
      ret = res;
    });

    expect(ret.name).toEqual('mock name');
    expect(ret.data).toEqual('mock data');
    expect(currentUserFuncspy.doc).toHaveBeenCalledWith('users/mock user');
    expect(userDocSpy.snapshotChanges).toHaveBeenCalled();

    // test observable
    currentUserRes.name = 'modified name';
    expect(ret.name).toEqual('modified name');
  });
});
