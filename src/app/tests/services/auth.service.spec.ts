import { TestBed } from '@angular/core/testing';

import { AuthService } from '../../services/auth.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AngularFireModule.initializeApp(environment.firebase), RouterTestingModule],
    providers: [AngularFirestore, AngularFireAuth]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
