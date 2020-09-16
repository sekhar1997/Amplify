import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UserService } from 'src/app/user.service';
// import { User } from 'src/app/Users';

// export interface user {
//   name: string;
//   id: number;
//   email: boolean;
// }
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'amplify';
  id: string;
  name: string;
  email: string;
  user: {};
  displayedColumns = ['Name', 'Email', 'id', 'action'];
  dataSource: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.dataSource = data;
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  deleteUser(val) {
    this.userService.delUser(val).subscribe(
      (data) => {
        window.location.reload();
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  addUser() {
    this.user = {
      id: this.id,
      Name: this.name,
      Email: this.email,
    };
    console.log(this.user);
    this.userService.addUser(this.user).subscribe(
      (data) => {
        window.location.reload();
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
    // console.log(this.id, this.name, this.email);
  }
}
