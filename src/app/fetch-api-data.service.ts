import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'; // should this be import { catchError } from 'rxjs/internal/operators'; ?
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring the api url that will provide data for the client app

const apiUrl = 'https://myflixapi-by-sjd58.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService /*should this be UserRegistrationService ? */{
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making itavailable via this.http
  constructor(private http: HttpClient) { }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public userLogin(userDetails: any): Observable<any> {
    return this.http
    .post(apiUrl + 'login', userDetails)
    .pipe(
      catchError(this.handleError)
    );
  }

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getSingleMovie(title: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getDirector(Name: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .get(apiUrl + `movies/director/${Name}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getGenre(Name: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .get(apiUrl + `movies/genre/${Name}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
    .get(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
    .get(apiUrl + `users/${username}/movies`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
    .post(apiUrl + `users/${username}/movies/${movieID}`, null, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  editUser(updateDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
    .put(apiUrl + `users/${username}`, updateDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
    .delete(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

  removeFavoriteMovie(movieID: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
    .delete(apiUrl + `users/${username}/movies/${movieID}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.log('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened: please try again later.');
  }
}
