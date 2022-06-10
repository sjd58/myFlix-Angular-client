import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/material/dialog';
import { DescriptionCardComponent } from '../description-card/description-card.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { FetchApiDataService } from '../fetch-api-data.service'
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

  //edit to be get movies and favorites
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
    });
  }

  getUserInfo() {
    if (localStorage.getItem('user') !=null) {
      let userData: any = localStorage.getItem('user');
      let username = JSON.parse(userData).Username;
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        this.user = resp;
      });
    };
  }

  openGenre(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '500px'
    });
  }

  openDescription(name: string, description: string): void {
    this.dialog.open(DescriptionCardComponent, {
      data: {
        Title: name,
        Description: description,
      },
      width: '500px'
    });
  }

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

  removeFromFavorites(movieId:string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((resp: any) => {
      const previousFavoritesMinusDisfavored = this.currentUserFavorites.filter(movie => movie._id !== movieId);
      this.currentUserFavorites = previousFavoritesMinusDisfavored;
      this.snackBar.open('Removed from favorites', 'OK', { duration: 2000});
    })
  }

  itIsAFave(movieId: string): any {
    const movieArray: any[] = this.currentUserFavorites;
    if(movieArray.some(movie => movie._id === movieId)){
      return true;
    } else {
      return false;
    }
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  signOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}