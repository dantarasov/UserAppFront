import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from './models/user';
import { UserService, } from './_services/user.service';
import { ImageService } from './image/image.service';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',],

})
export class AppComponent implements OnInit {
  title: 'userapp';
   

  user: User = {
    id: 0,
    name: '',
    password: '',
    email: '',
    gender: '',
    phone: '',
    imageURL: ''
  }

  public users: User[];
  public edituser: User;
  public deleteuser: User;
  public filter: User;

  selectedFile: File;
  imageUrl: any;  // для отправки выбранного фото при добавлении
  editImageUrl: any; // для отправки выбранного фото при редактировании. Две разные переменные для двух разных мод.окон
  userImages: any[];

  private roles: string[] = [];
  public isLoggedIn = false;
  showAdminBoard = false;
  name?: string;


  constructor(private userService: UserService, private imageService: ImageService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.getusers();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.name = user.name;
    }
  }
  public getusers(): void {
    this.userService.getUsers().subscribe({
      next: (response: User[]) => {
        this.getAllImages();
        this.users = response;

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

  onFileSelected(event: any, mode: string) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (ev: any) => {
      if (mode === 'editInput') {
        console.log("editInput",)
        this.edituser.imageURL = ev.target.result;
        this.editImageUrl = this.edituser.imageURL;
      }
      if (mode === 'addInput') {
        console.log("addInput",)
        this.imageUrl = ev.target.result;
      }
    };
  }

  saveNewImage(user: User, img: any) {
    this.imageService.uploadProfileImage(user, img.split(/,(.+)/)[1])
  }

  getAllImages() {
    this.imageService.getAllProfileImages().subscribe(images => {
      this.userImages = images;
      this.users.map((user) => {
        this.userImages.map((entry) => {
          if (user.id == entry.id) {
            user.imageURL = entry.path
            this.edituser = entry.path
          }
        });
      });
    });
  }
  public onUpdateuser(user: User): void {
    this.userService.updateuser(user).subscribe({
      next: (response: User) => {
        this.user = response;
        if (this.editImageUrl) {
          this.saveNewImage(this.user, this.editImageUrl)
        }
        this.getusers();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteuser(userId: number): void {
    this.userService.deleteuser(userId).subscribe({
      next: (response: void) => {
        this.imageService.deleteImage(userId)
        this.getusers();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public findusers(key: string): void {
    console.log(key)
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

  
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}