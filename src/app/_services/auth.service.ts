import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }
    
    login(name: string, password: string): Observable<any> {
        return this.http.post(environment.API_URL + 'signin', {
            name,
            password
        }, httpOptions);
    }

    register(name: string, gender: string, email: string, password: string, phone: string): Observable<any> {
        return this.http.post(environment.API_URL + 'signup', {
            name,
            gender,
            email,
            password,
            phone
        }, httpOptions);
    }
}