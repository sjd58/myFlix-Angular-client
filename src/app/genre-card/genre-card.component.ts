/**
 * GenreCardComponent is meant to display information about genres to users.
 * @module GenreCardComponent
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-card',
  templateUrl: './genre-card.component.html',
  styleUrls: ['./genre-card.component.scss']
})

/**
 * 
 * @param data
 */
export class GenreCardComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Description: string;
    }
  ) { }

  ngOnInit(): void {
  }

}
