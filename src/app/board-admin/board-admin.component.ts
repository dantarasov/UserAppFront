import { Component , OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageService } from '../image/image.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  user: User = {
    id: 0,
    name: '',
    password: '',
    email: '',
    gender: '',
    phone: '',
    imageURL: ''
  }

  imageUrl: any;  // для отправки выбранного фото при добавлении
  public users: User[];
  userImages: any[];
  usersCounter: number;
  public deleteUser: User;

  constructor(private userService: UserService, private imageService: ImageService, private appComponent: AppComponent ) { }
  ngOnInit(): void {
    this.getusers();
  }
  getusers(): void {
    this.userService.getUsers().subscribe({
      next: (response: User[]) => {
        this.getAllImages();
        this.users = response;
        this.usersCounter = this.users.length;
        this.user = {
          id: 0,
          name: '',
          password: '',
          email: '',
          gender: '',
          phone: '',
          imageURL: ''
        }
        this.imageUrl = ''
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  getAllImages() {
    this.imageService.getAllProfileImages().subscribe(images => {
      this.userImages = images;
      this.users.map((user) => {
        this.userImages.map((entry) => {
          if (user.id == entry.id) {
            user.imageURL = entry.path
          }
        });
      });
    });
  }
  public findUsers(key: string): void {
    console.log(key)
    this.getusers();
    const results: User[] = [];
    for (const user of this.users) {
      if (user.name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !key) {
      this.getusers();

    }
  }
   onOpenModal(user: User, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'delete') {
      this.deleteUser = user;
      button.setAttribute('data-target', '#deleteUserModal');
    }
    if (container) { // с проверкой ангуляр удостоверяется в существовании элемента
      container.appendChild(button);
      button.click();
    }
  }
  public onDeleteUser(userId: number): void {
    this.userService.deleteuser(userId).subscribe({
      next: (response: void) => {
        const logout = document.getElementById('logout');
        logout?.click();
        this.appComponent.isLoggedIn = false;
         this.imageService.deleteImage(userId)
    
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
}
