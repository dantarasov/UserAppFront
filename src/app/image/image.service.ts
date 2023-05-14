import { Inject, Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { map } from "rxjs";
import { FirebaseAppModule } from '@angular/fire/app';
import { Searcher } from "../searcher";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private af: AngularFireDatabase, private storage: AngularFireStorage,
    @Inject(FirebaseAppModule) private firebaseApp: any) { }

  uploadProfileImage(searcher: Searcher, img: any) {
    let storageRef = this.storage.ref(`/profile/${searcher.id}`);
    storageRef.putString(img, 'base64', { contentType: 'image/png' }).then((snapshot: any) => {
      console.log('Uploaded a blob or file! Now storing the reference at', `/profile/images/`, searcher.id);
      storageRef.getDownloadURL().subscribe(url => {
        let result = { img: url }
        this.af.database.ref(`users/${searcher.id}/profile/image`).update({ path: result, filename: searcher.id })
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
  deleteImage(id: number): void {
    this.storage.ref(`/profile/${id}`).delete();
    this.af.object(`users/${id}`).remove();
  }
} 
