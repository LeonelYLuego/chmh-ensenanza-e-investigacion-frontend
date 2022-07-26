import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@data/interfaces';
import { UsersService } from '@data/services';
import { UserDialogComponent } from '../../dialogs/user-dialog/user-dialog.component';

/** @class Users Page Component */
@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = [
    'username',
    'administrator',
    'update',
    'delete',
  ];
  loading = false;

  constructor(private usersService: UsersService, private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.users = await this.usersService.getAll();
    this.loading = false;
  }

  /**
   * Opens User Dialog to add User
   * @function addUserDialog
   */
  addUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
    });

    dialogRef
      .afterClosed()
      .subscribe(async () => (this.users = await this.usersService.getAll()));
  }

  /**
   * Opens User Dialog to modify User
   * @function updateUserDialog
   * @param {User} user The User to modify
   */
  updateUserDialog(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: user,
    });

    dialogRef
      .afterClosed()
      .subscribe(async () => (this.users = await this.usersService.getAll()));
  }

  /**
   * Deletes a specified User
   * @async
   * @param {string} _id _id of the User
   */
  async delete(_id: string): Promise<void> {
    await this.usersService.delete(_id);
    this.users = await this.usersService.getAll();
  }
}
