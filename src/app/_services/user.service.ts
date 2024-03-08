import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({providedIn: 'root' })//'root' : The application-level injector in most apps. Allows app know about the service
export class UserService {
  constructor(private http: HttpClient){}


  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.API_URL + `auth/all`);
  }
  public getUser(userId: number): Observable<User> {
    return this.http.get<User>(environment.API_URL + `auth/find/${userId}`);
  }
     
  public updateuser(user: User): Observable<User> {
    return this.http.put<User>(environment.API_URL + `auth/update`, user);    
  }
  public deleteuser(userId: number): Observable<void> {
    return this.http.delete<void>(environment.API_URL + `auth/delete/${userId}`);    
  }
  
  getPublicContent(): Observable<any> {
    return this.http.get(environment.API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(environment.API_URL+'test/' + 'user', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(environment.API_URL + 'admin', { responseType: 'text' });
  }
}

