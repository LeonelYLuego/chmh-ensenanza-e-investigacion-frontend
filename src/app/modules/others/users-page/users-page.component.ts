import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@app/data/interfaces/user';
import { UsersService } from '@app/data/services/users.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

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
    this.users = await this.usersService.getUsers();
    this.loading = false;
  }

  /**
   * Opens User Dialog
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
      .subscribe(async () => (this.users = await this.usersService.getUsers()));
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
      .subscribe(async () => (this.users = await this.usersService.getUsers()));
  }

  async delete(_id: string): Promise<void> {
    await this.usersService.deleteUser(_id);
    this.users = await this.usersService.getUsers();
  }
}
