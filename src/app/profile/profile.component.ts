import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { ImageService } from '../image/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: any;
  user: User = {
    id: 0,
    name: '',
    password: '',
    email: '',
    gender: '',
    phone: '',
    imageURL: ''
  }
  public editUser: User;
  public deleteUser: User;
  selectedFile: File;
  imageUrl: any;  // для отправки выбранного фото при добавлении
  editImageUrl: any; // для отправки выбранного фото при редактировании. Две разные переменные для двух разных мод.окон
  userImage: any;  // для полчуения фото

  constructor(private token: TokenStorageService,
    private userService: UserService,
    private router: Router, private appComponent: AppComponent,
    private imageService: ImageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();// получаем только данные для авторизации
    this.user.id = this.currentUser.id;
    this.getUser();
  }
  getUser(): void {
    this.userService.getUser(this.user.id).subscribe({
      next: (response: User) => {
        this.getImage();
        this.user = response
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
  
  getImage() {
    this.imageService.getProfileImage().subscribe(image => {
      this.userImage = image;
      this.userImage.map((entry: { id: any; path: any; }) => {
        if (this.user.id == entry.id) {
          this.user.imageURL = entry.path
          this.editUser = entry.path
        }
      });
    });
  };

  onFileSelected(event: any, mode: string) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (ev: any) => {
        this.editUser.imageURL = ev.target.result;
        this.editImageUrl = this.editUser.imageURL;
    };
  }

  saveNewImage(user: User, img: any) {
    this.imageService.uploadProfileImage(user, img.split(/,(.+)/)[1])
  }

  public onUpdateUser(user: User): void {
    this.userService.updateuser(user).subscribe({
      next: (response: User) => {
        this.user = response;
        if (this.editImageUrl) {
          this.saveNewImage(this.user, this.editImageUrl)
        }
        this.getUser();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteUser(userId: number): void {
    this.userService.deleteuser(userId).subscribe({
      next: (response: void) => {
        const logout = document.getElementById('logout');
        logout?.click();
        this.appComponent.isLoggedIn = false;
         this.imageService.deleteImage(userId)
        this.gotoHome();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onOpenModal(user: User, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'edit') {
      this.editUser = user;
      this.editUser.password = "";
      button.setAttribute('data-target', '#updateUserModal');
    }
    if (mode === 'delete') {
      this.deleteUser = user;
      button.setAttribute('data-target', '#deleteUserModal');
    }
    if (container) { // с проверкой ангуляр удостоверяется в существовании элемента
      container.appendChild(button);
      button.click();
    }
  }

  async gotoHome() {
    await this.router.navigate(['/home']);
  }
}