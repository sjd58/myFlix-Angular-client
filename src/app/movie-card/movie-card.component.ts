/**
 * MovieCardComponent allows users to view movies and add their favorites to their profiles.
 * @module MovieCardComponent
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/material/dialog';
import { DescriptionCardComponent } from '../description-card/description-card.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { FetchApiDataService } from '../fetch-api-data.service'
import { ProfileViewComponent } from '../profile-view/profile-view.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  user: any = {
    Username: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  }
  currentUserFavorites: any[] =[];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    ) { }

  ngOnInit(): void {
    //this.getUserInfo();
    this.getMovies();
  }

  /**
   * Make an API endpoint call to get all movies.
   * @function getMovies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
    });
  }

  /**
   * Make an API endpoint call go get user information.
   * @function getUserInfo
   */
  getUserInfo() {
    if (localStorage.getItem('user') !=null) {
      let userData: any = localStorage.getItem('user');
      let username = JSON.parse(userData).Username;
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        this.user = resp;
      });
    };
  }

  /**
   * Open dialog to display GenreCardComponent
   * @module openGenre
   * @param name {string}
   * @param description {string}
   */
  openGenre(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '500px'
    });
  }

  /**
   * Open dialog to display DescriptionCardComponent
   * @module DescriptionCardComponent
   * @param name {string}
   * @param description {string}
   */
  openDescription(name: string, description: string): void {
    this.dialog.open(DescriptionCardComponent, {
      data: {
        Title: name,
        Description: description,
      },
      width: '500px'
    });
  }

  /**
   * Open dialog to display DirectorCardComponent
   * @module DirectorCardComponent
   * @param name {string}
   * @param bio {string}
   * @param birth {string}
   * @param death {string}
   */
  openDirector(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorCardComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
        Death: death,
      },
      width: '500px'
    });
  }

  /**
   * Make an API endpoint call to add a movie to the user's favorites.
   * @function addToFavorites
   * @param movieId {string}
   */
  addToFavorites(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe((resp: any) => {
      this.movies.forEach((movie) => {
        if (movie._id == movieId) {
          this.currentUserFavorites.push(movie);
        }
      });
      this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
    });
  }

  /**
   * Make an API endpoint call to remove a move from the user's favorites.
   * @function removeFromFavorites
   * @param movieId 
   */
  removeFromFavorites(movieId:string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((resp: any) => {
      const previousFavoritesMinusDisfavored = this.currentUserFavorites.filter(movie => movie._id !== movieId);
      this.currentUserFavorites = previousFavoritesMinusDisfavored;
      this.snackBar.open('Removed from favorites', 'OK', { duration: 2000});
    })
  }

  /**
   * This function monitors the favorite status of each movie so the component displays the correct favorite icon.
   * @function itIsAFave
   * @param movieId {string}
   * @returns Boolean
   */
  itIsAFave(movieId: string): any {
    const movieArray: any[] = this.currentUserFavorites;
    if(movieArray.some(movie => movie._id === movieId)){
      return true;
    } else {
      return false;
    }
  }

  /**
   * Navigate to the profile component
   * @function openProfile
   */
  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * This function signs the user out by clearing their JWT from localStorage
   * @function signOut
   */
  signOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}