import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../modules/material-module';
import { HeaderComponent } from './header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule
      ],
      declarations: [ HeaderComponent ],
      providers: [AuthService, AngularFireModule, AngularFireAuthModule, AngularFireAuth, AngularFirestore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
