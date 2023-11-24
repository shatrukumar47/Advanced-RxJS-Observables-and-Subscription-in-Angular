import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, catchError, filter, interval, map, take, takeUntil, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private api = "https://jsonplaceholder.typicode.com/posts";
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private http: HttpClient) { }

  getData(page:number = 1): Observable<any[]>{
    const params = {
      _page: page,
      _limit: 15
    }
    return this.http.get<any>(this.api, {params})
    .pipe(
      takeUntil(this.destroy$),
      catchError((error)=>{
        console.log(error);
        return throwError("An error occurred during data retrieval")
      })
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
