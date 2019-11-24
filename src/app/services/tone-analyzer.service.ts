import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ToneAnalyzerService {

  uri = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  toneAnalyze(data) {
    return this.http.post(`${this.uri}/tone`, { text: data });
  }

}
