import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


/**
 * This states the API URL that will provide data for the client app.
 */
const apiUrl = 'https://myflixapi-by-sjd58.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService{
/**
 * This is where we inject the HttpClient module to the constructor params.
 * This will provide HttpClient to the entire class, making it available via this.http
 * @param http 
 */
  constructor(private http: HttpClient) {
  }

  /**
   * Make API call to the user registration endpoint
   * @function userRegistration
   * @param userDetails
   * @returns a JSON object with user info (name, birthday, email)
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  /**
   * Make API call to the user login endpoint
   * @function userLogin
   * @param userDetails
   * @returns a Json object with user info including favorites.
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
    catchError(this.handleError)
    );
  }
  
  /**
   * Make API call to get all movies
   * @function getAllMovies
   * @returns Array of movie objects
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Non-Typed response extraction
   * @function extractResponseData
   * @param res {any}
   * @returns  response || { };
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  /**
   * Makes an API call to get one particular movie
   * @function getMovie
   * @param movieID
   * @returns object with data about that particular movie
   */
  getMovie(movieID: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes an API call to get more information about a particular director
   * @function getDirector
   * @param directorName
   * @returns 
   */
  getDirector(directorName: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'directors/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Make an API call to get information about a particular genre
   * @function getGenre
   * @param genreName
   * @returns object with data about that particular genre
   */
  getGenre(genreName: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'genres/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to get information about a particular user
   * @function getUser
   * @param username 
   * @returns  object with all information about a user, including their favorites
   */
  getUser(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes an API call to get information about a particular user's favorites.
   * @function getFavorites
   * @param username
   * @returns object with a key of "favorites" with an array of the favorites
   */
  getFavorites(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username + '/favorites', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes an API call to add a movie to the user's favorites.
   * @function addFavoriteMovie
   * @param movieID 
   * @returns object with information about the user, including the updated user's favorites.
   */
  addFavoriteMovie(movieID: any): Observable<any> {
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieID, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes an API call to remove a user favorite movie.
   * @function deleteFavoriteMovie
   * @param movieID 
   * @returns  object with the updated user favorites.
   */
  deleteFavoriteMovie(movieID: any): Observable<any> {
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes an API call to edit the user details
   * @function editUser
   * @param userDetails 
   * @returns object with information about the user
   */
  editUser(userDetails: any): Observable<any> {
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, userDetails, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes an API call to delete a user
   * @function deleteUser
   * @param username 
   * @returns If successful, a string declaring that the user was deleted.
   */
  deleteUser(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }
}