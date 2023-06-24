import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class Connect4Service {

  constructor(private http: HttpClient) {
  }

  addToken(column: number): Observable<any> {
    return this.http.post<any>(`api/token?column=${column}`, {})
  }
}
