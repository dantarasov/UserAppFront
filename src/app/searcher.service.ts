import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Searcher } from './searcher';

@Injectable({providedIn: 'root' })//'root' : The application-level injector in most apps. Allows app know about the service
export class SearcherService {
  private apiServerUrl = environment.baseApiUrl;

  constructor(private http: HttpClient){}

  public getSearchers(): Observable<Searcher[]> {
    return this.http.get<Searcher[]>(`${this.apiServerUrl}/searcher/all`);
  }
     
  public addSearcher(searcher: Searcher): Observable<Searcher> {
    return this.http.post<Searcher>(`${this.apiServerUrl}/searcher/add`, searcher);
  }

  public updateSearcher(searcher: Searcher): Observable<Searcher> {
    return this.http.put<Searcher>(`${this.apiServerUrl}/searcher/update`, searcher);    
  }
  public deleteSearcher(searcherId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/searcher/delete/${searcherId}`);    
  }
}
