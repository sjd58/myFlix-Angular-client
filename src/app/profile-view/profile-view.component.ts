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

  getUser() {
    if (localStorage.getItem('user') != null) {
      const username = localStorage.getItem('user');
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        console.log(resp);
        this.user = resp;
      });
    }
  }

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

  goToMovieCard(): void {
    this.router.navigate(['movies']);
  }

  openUpdateInfoCard(): void {
    this.dialog.open(UpdateInfoComponent, {
      width: '500px'
    });
  }

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

  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((resp: any) => {
      const previousFavoritesMinusDisfavored = this.currentUsersFaves.filter(movie => movie._id !== movieId);
      this.currentUsersFaves = previousFavoritesMinusDisfavored;
      this.snackBar.open('Remove from favorites', 'OK', { duration: 2000 });
    })
  }

  itIsAFave(movieId: string): any {
    const movieArray: any[] = this.currentUsersFaves;
    if(movieArray.some(movie => movie._id === movieId)){
      return true;
    } else {
      return false;
    }
  }

  signOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}