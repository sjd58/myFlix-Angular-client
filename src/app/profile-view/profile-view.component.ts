/**
 * ProfileViewComponent is used to view the user's profile. It is linked to the update-info component so users can update their info.
 * @module ProfileViewComponent
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router} from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { UpdateInfoComponent } from '../update-info/update-info.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { DescriptionCardComponent } from '../description-card/description-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreCardComponent } from '../genre-card/genre-card.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})

export class ProfileViewComponent implements OnInit {
  movies: any[] = [];
  user: any = {
    Username: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  }
  currentUsersFaves: any[] =[];

  constructor(
    public fetchApiData: FetchApiDataService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getMoviesAndFaves();
  }

  /**
   * Make an API endpoint call to get user info
   * @function getUser
   */
  getUser() {
    if (localStorage.getItem('user') != null) {
      const username = localStorage.getItem('user');
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        console.log(resp);
        this.user = resp;
      });
    }
  }

  /**
   * Make an API endpoint call to get the user's favorite movies
   * @function getMoviesAndFaves
   */
  getMoviesAndFaves() {
    this.fetchApiData.getAllMovies().subscribe((res: any) =>{
      this.movies = res;
      this.movies.forEach((movie) =>{
        if (this.user.FavoriteMovies.includes(movie._id)) {
          this.currentUsersFaves.push(movie);
        }
      });
    });
  }

  /**
   * Makes the router navigate to the MovieCardComponent
   * @function goToMovieCard
   */
  goToMovieCard(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Open UpdateInfoComponent dialog
   * @module openUpdateInfoCard
   */
  openUpdateInfoCard(): void {
    this.dialog.open(UpdateInfoComponent, {
      width: '500px'
    });
  }

  /**
   * Open the dialog to display the DirectorCardComponent
   * @module openDirector
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
        Death: death
      },
      width: '500px'
    });
  }

  /**
   * Open the dialog box to display GenreCardComponent
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
   * Open the dialog box to display DescriptionCardComponent
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
   * Call the API to add a favorite movie.
   * @function addToFavorites
   * @param movieId {string}
   */
  addToFavorites(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe((resp: any) => {
      this.movies.forEach((movie) => {
        if (movie._id == movieId) {
          this.currentUsersFaves.push(movie);
        }
      });
      this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
    });
  }

  /**
   * Call the API to remove a favorite movie.
   * @function removeFromFavorites
   * @param movieId
   */
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((resp: any) => {
      const previousFavoritesMinusDisfavored = this.currentUsersFaves.filter(movie => movie._id !== movieId);
      this.currentUsersFaves = previousFavoritesMinusDisfavored;
      this.snackBar.open('Remove from favorites', 'OK', { duration: 2000 });
    })
  }

  /**
   * This keeps track of whether or not a given movie is a favorite so the app can display the correct favorite icon.
   * @function itIsAFave
   * @param movieId {string}
   * @returns Boolean
   */
  itIsAFave(movieId: string): any {
    const movieArray: any[] = this.currentUsersFaves;
    if(movieArray.some(movie => movie._id === movieId)){
      return true;
    } else {
      return false;
    }
  }

  /**
   * This function logs a user out by clearing their JWT from localStorage
   * @function signOut
   */
  signOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}