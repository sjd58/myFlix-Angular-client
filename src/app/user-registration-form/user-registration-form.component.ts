/**
 * The purpose of UserRegistrationFormComponent is to allow users to create new profiles.
 * @module UserRegistrationFormComponent
 */

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  /**
   * This binds data entered by the user to the userData object
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

/**
 * This function makes a call to the API to register the user. A JSON object is returned
 * which includes the JWT token stored in localStorage so the user can be logged in.
 * @function loginUser
 */
registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
     this.dialogRef.close(); // This will close the modal on success!
     console.log(result);
     this.snackBar.open(result, 'OK', {
        duration: 2000
     });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  }