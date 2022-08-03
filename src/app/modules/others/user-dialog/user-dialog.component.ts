import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@app/data/interfaces/user';
import { UserService } from '@app/data/services/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent {
  user = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    administrator: new FormControl(false),
  });

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: User | undefined,
  ) {
    if(data) {
      this.user.setValue({
        administrator: data.administrator,
        password: '',
        username: data.username,
      })
    }
  }

  //Validate if exists an error
  async addUser(): Promise<void> {
    const value = this.user.value;
    if (this.user.valid) {
      const res = await this.userService.addUser({
        _id: '',
        administrator: value.administrator!,
        username: value.username!,
        password: value.password!,
      });
      if(res) {
        this.close();
      }
    }
  }

  //Validate if exists an error
  async updateUser(): Promise<void> {
    
  }

  close(): void {
    this.dialogRef.close();
  }
}
