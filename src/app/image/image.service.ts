import { Inject, Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { map } from "rxjs";
import { FirebaseAppModule } from '@angular/fire/app';
import { User } from "../models/user";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private af: AngularFireDatabase, private storage: AngularFireStorage,
    @Inject(FirebaseAppModule) private firebaseApp: any) { }

  uploadProfileImage(user: User, img: any) {
    let storageRef = this.storage.ref(`/profile/${user.id}`);
    storageRef.putString(img, 'base64', { contentType: 'image/png' }).then((snapshot: any) => {
      console.log('Uploaded a blob or file! Now storing the reference at', `/profile/images/`, user.id);
      storageRef.getDownloadURL().subscribe(url => {
        let result = { img: url }
        this.af.database.ref(`users/${user.id}/profile/image`).update({ path: result, filename: user.id })
      })
    });
  }

  getAllProfileImages(): Observable<any[]> {
    return this.af.list(`users`).snapshotChanges().pipe(// в users проходимся по каждой id пользователя
      map(changes =>
        changes.map(userId => ({
          id: userId.payload.key, //берем имя фото, названое в честь id пользователя
          path: userId.payload.child(`profile/image/path/img`).val()  //и путь до storage                        
        }))
      )
    );
  }
  getProfileImage(): Observable<any> {
    return this.af.list(`users`).snapshotChanges().pipe(// в users проходимся по каждой id пользователя
      map(changes =>
        changes.map(userId => ({
          id: userId.payload.key, //берем имя фото, названое в честь id пользователя
          path: userId.payload.child(`profile/image/path/img`).val()  //и путь до storage                        
        }))
      )
    );
  }
  deleteImage(id: number): void {
    this.storage.ref(`/profile/${id}`).delete();
    this.af.object(`users/${id}`).remove();
  }
} 
