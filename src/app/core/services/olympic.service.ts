import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  // Load the initial data
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  /**
   * Returns the observable of all the olympics
   *
   * @returns The observable with all the olympics
   */
  getOlympics() {
    return this.olympics$.asObservable();
  }

  /**
   * Returns the observable of a chosen country
   *
   * @param country - The chosen country
   * @returns The observable of that country
   */
  getOlympicByCountry(country: string) {
    // filter countries on specified country in argument
    return this.getOlympics().pipe(
      map((olympics) => olympics.find((olympic) => olympic.country === country))
    );
  }

  /**
   * Returns the total number of medals for a chosen country
   *
   * @param olympic - The chosen country
   * @returns The addition of all numbers of medals for that country
   */
  countMedals(olympic: Olympic): number {
    let medals: number = 0;

    for (let participation of olympic.participations) {
      medals += participation.medalsCount;
    }
    return medals;
  }
}
