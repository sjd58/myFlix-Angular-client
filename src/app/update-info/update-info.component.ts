import { Component, OnInit, Inject, Input, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.scss']
})
export class UpdateInfoComponent implements OnInit {

  @Input() newData = { Username: '', Password: '', Email: '', Birthday: ''}

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UpdateInfoComponent>,
    public snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      username: string;
      password: string;
      email: string;
      birthday: Date;
    }
  ) { }

  ngOnInit(): void {
  }

  editUser(): void {
    if (this.newData.Username && this.newData.Password && this.newData.Email && this.newData.Birthday) {
      this.fetchApiData.editUser(this.newData).subscribe((resp: any) => {
        this.dialogRef.close();
        window.location.reload();
        localStorage.setItem('user', JSON.stringify(resp));
        this.snackbar.open('Data Successfully updated', 'OK', { duration: 2000 })
      });
    } else {
      this.snackbar.open('Please fill all the fields', 'OK', { duration: 2000 })
    }
  }

}
