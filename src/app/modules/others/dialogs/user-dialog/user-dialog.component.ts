import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@app/data/interfaces/user';
import { UsersService } from '@app/data/services/users.service';

/** User Dialog Component */
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
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: User | undefined
  ) {
    if (data) {
      this.user.setValue({
        administrator: data.administrator,
        password: '',
        username: data.username,
      });
    }
  }

  /**
   * Sends the data to add an User
   * @async
   * @function addUser
   */
  async addUser(): Promise<void> {
    const value = this.user.value;
    if (this.user.valid) {
      const res = await this.usersService.addUser({
        _id: '',
        administrator: value.administrator!,
        username: value.username!,
        password: value.password!,
      });
      if (res) {
        this.close();
      }
    }
  }

  //Validate if exists an error
  async updateUser(): Promise<void> {
    const value = this.user.value;
    if (this.user.valid) {
      const res = await this.usersService.updateUser(this.data!._id, {
        _id: this.data!._id,
        username: value.username!,
        password: value.password!,
        administrator: value.administrator!,
      });
      if (res) {
        this.close();
      }
    }
  }

  /**
   * Close the Dialog
   * @function close
   */
  close(): void {
    this.dialogRef.close();
  }
}
