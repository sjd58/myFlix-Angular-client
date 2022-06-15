import { Component, OnInit, Inject, Input, } from '@angular/core';
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
    this.fetchApiData.editUser(this.newData).subscribe((resp) => {
      this.dialogRef.close();
      localStorage.setItem('user', resp.Username);
      this.snackbar.open('Your profile was updated successfully.', 'OK', {
        duration: 2000
      });
      setTimeout(() => {
        window.location.reload();
      });
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
