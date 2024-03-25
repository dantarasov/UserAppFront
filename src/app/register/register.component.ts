import { Component,OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ImageService } from '../image/image.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
}) 
export class RegisterComponent implements OnInit {

  user: User = {
    id: 0,
    name: '',
    password: '',
    email: '',
    gender: '',
    phone: '',
    imageURL: ''
  }

  imageURL: any;
  selectedFile: File;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,
    private router: Router, private imageService: ImageService  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { name, gender, email, password, phone } = this.user;
    this.authService.register(name, gender, email, password, phone).subscribe({
      next: (response: User) => {
        this.user = response; 
        if (this.imageURL) {
          this.saveNewImage(this.user, this.imageURL)
        }
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.gotoLogin();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
      }   
  });
  }
  onFileSelected(event: any, mode: string) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (ev: any) => {
      if (mode === 'addInput') {
        console.log("addInput",)
        this.imageURL = ev.target.result;
      }
    };
  }
  saveNewImage(user: User, img: any) {
    this.imageService.uploadProfileImage(user, img.split(/,(.+)/)[1])
  }

  async gotoLogin(){
   await this.router.navigate(['/login']);
  }
}
