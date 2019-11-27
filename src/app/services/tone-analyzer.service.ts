import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToneAnalyzerService {

  uri = environment.production ?
    'http://ec2-184-72-105-146.compute-1.amazonaws.com/' :
    'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  toneAnalyze(data) {
    return this.http.post(`${this.uri}/tone`, { text: data });
  }

}
