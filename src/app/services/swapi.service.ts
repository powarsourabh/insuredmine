import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {



  private baseUrl = 'https://swapi.dev/api/';

  constructor(private http:HttpClient) { }

  getPeople(): Observable<any> {
    return this.http.get(`${this.baseUrl}people/`);
  }

  getPerson(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}people/${id}/`);
  }

 

  getSpecies(url: string): Observable<any> {
    return this.http.get(url);
  }
  

  getVehicles(urls: string[]): Observable<any[]> {
    return forkJoin(urls.map(url => this.http.get(url)));
  }

  getMovies(urls: string[]): Observable<any[]> {
    return forkJoin(urls.map(url => this.http.get(url)));


  }

  getStarships(urls: string[]): Observable<any[]> {
    return forkJoin(urls.map(url => this.http.get(url)));
  }
}
