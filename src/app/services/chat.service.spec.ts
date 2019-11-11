import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { ChatService } from '../../app/services/chat.service';

describe('ChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatService = TestBed.get(ChatService);
    expect(service).toBeTruthy();
  });
});
