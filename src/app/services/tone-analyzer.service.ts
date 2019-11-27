import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToneAnalyzerService {

  constructor(private http: HttpClient) { }

  toneAnalyze(data) {
    return this.http.post(`${environment.uri}/api/tone`, { text: data });
  }

}
