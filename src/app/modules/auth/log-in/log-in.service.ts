import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/data/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  constructor(private http: HttpClient) { }

  request(user: User) {
    this.http.post<{
      
    }>('http://localhost:3000/auth/log-in', user).subscribe(data => {
      console.log(data);
    });
  }
}
