import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@app/data/interfaces/user';
import { UserService } from '@app/data/services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

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

  constructor(private userService: UserService, private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    this.users = await this.userService.getUsers();
  }

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
      .subscribe(async () => (this.users = await this.userService.getUsers()));
  }

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
      .subscribe(async () => (this.users = await this.userService.getUsers()));
  }
}
